from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from datetime import datetime, timezone # Đã import thêm timezone

app = FastAPI(title="FUZZY AI Segmentation Service")

# 1. Kết nối vào MongoDB (ĐÃ SỬA LẠI TÊN DATABASE)
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "fuzzy_furniture" 

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

@app.get("/")
def read_root():
    return {"message": "FUZZY AI Microservice is running!"}

@app.post("/api/segment")
def train_and_segment():
    """
    API này sẽ kéo dữ liệu từ MongoDB, tính toán RFM, 
    chạy K-Means và cập nhật nhãn phân khúc cho user.
    """
    # Lấy dữ liệu Orders từ DB
    orders_cursor = db.orders.find({"status": "Completed"})
    orders_list = list(orders_cursor)
    
    if not orders_list:
        raise HTTPException(status_code=400, detail="Không có dữ liệu đơn hàng để phân tích")

    # Đưa vào Pandas DataFrame để xử lý
    df = pd.DataFrame(orders_list)
    
    # Đảm bảo orderDate là kiểu datetime và ép về UTC để khớp với Database
    df['orderDate'] = pd.to_datetime(df['orderDate'], utc=True)
    
    # Xác định mốc thời gian hiện tại (ĐÃ FIX LỖI MÚI GIỜ)
    current_date = datetime.now(timezone.utc)
    
    # 2. Tính toán RFM
    # Tính số ngày kể từ lần mua cuối (Recency)
    df['Recency'] = (current_date - df['orderDate']).dt.days
    
    rfm = df.groupby('user').agg({
        'Recency': 'min',              # Lần mua gần nhất
        '_id': 'count',                # Tổng số đơn (Frequency)
        'totalAmount': 'sum'           # Tổng tiền chi (Monetary)
    }).rename(columns={'_id': 'Frequency', 'totalAmount': 'Monetary'})


    # 3. Chuẩn hóa dữ liệu & Huấn luyện K-Means
    scaler = StandardScaler()
    rfm_scaled = scaler.fit_transform(rfm)
    
    kmeans = KMeans(n_clusters=3, random_state=42)
    kmeans.fit(rfm_scaled)
    rfm['Cluster'] = kmeans.labels_
    
    # --- LOGIC MỚI: TỰ ĐỘNG ĐỊNH DANH CỤM ---
    cluster_means = rfm.groupby('Cluster').mean()
    
    cluster_labels = {}
    for cluster_id in cluster_means.index:
        mean_r = cluster_means.loc[cluster_id, 'Recency']
        mean_f = cluster_means.loc[cluster_id, 'Frequency']
        
        if mean_r == cluster_means['Recency'].max():
            cluster_labels[cluster_id] = "Dormant"
        elif mean_f == cluster_means['Frequency'].max():
            cluster_labels[cluster_id] = "VIP"
        else:
            cluster_labels[cluster_id] = "Casual"

    rfm['Segment_Name'] = rfm['Cluster'].map(cluster_labels)
    # ----------------------------------------

    # 4. Lưu kết quả trở lại MongoDB
    results_updated = 0
    for user_id, row in rfm.iterrows():
        db.users.update_one(
            {"_id": user_id},
            {"$set": {
                "segment": row['Segment_Name'],
                "rfmScores": {
                    "recency": int(row['Recency']),
                    "frequency": int(row['Frequency']),
                    "monetary": float(row['Monetary'])
                }
            }}
        )
        results_updated += 1

    return {
        "status": "success", 
        "message": f"Đã cập nhật phân khúc cho {results_updated} users.",
        "cluster_mapping": cluster_labels 
    }