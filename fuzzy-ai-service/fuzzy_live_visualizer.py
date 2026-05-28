# -*- coding: utf-8 -*-
"""
FUZZY AI - HỆ THỐNG TRỰC QUAN HÓA DỮ LIỆU REAL-TIME
--------------------------------------------------
Mục đích: Kết nối trực tiếp MongoDB local, lấy dữ liệu đơn hàng thật,
          chạy thuật toán K-Means và dựng đồ thị 3D phục vụ chấm đồ án.
"""

import sys
import warnings
# Ẩn các cảnh báo hệ thống không cần thiết (bao gồm cảnh báo đếm nhân CPU)
warnings.filterwarnings("ignore")

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pymongo import MongoClient
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from datetime import datetime

# 1. CẤU HÌNH KẾT NỐI MONGODB (Sửa lại đúng cổng local của bạn)
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "fuzzy_furniture"  # Hoặc "fuzzy_app" tùy theo tên DB thực tế của bạn

print("="*60)
print("  FUZZY AI LIVE VISUALIZER - ĐANG KẾT NỐI DATABASE THỰC TẾ... ")
print("="*60)

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client[DB_NAME]
    # Kiểm tra kết nối
    client.server_info()
    print(f"-> Kết nối thành công tới MongoDB: {DB_NAME}\n")
except Exception as e:
    print("❌ LỖI: Không thể kết nối tới MongoDB Local!")
    print("Vui lòng bật XAMPP/MongoDB Service và kiểm tra lại cổng kết nối.")
    sys.exit()

# 2. TRÍCH XUẤT DỮ LIỆU THỰC TẾ TỪ COLLECTION ORDERS
print("[Bước 1] Đang đọc dữ liệu đơn hàng 'Completed' từ database...")
orders_cursor = db.orders.find({"status": "Completed"})
orders_list = list(orders_cursor)

if len(orders_list) == 0:
    print("❌ LỖI: Không có đơn hàng nào ở trạng thái 'Completed' trong database!")
    print("Vui lòng tạo hoặc cập nhật trạng thái đơn hàng trên app thành 'Completed' trước.")
    sys.exit()

df_orders = pd.DataFrame(orders_list)
print(f"-> Tìm thấy {len(df_orders)} đơn hàng đã hoàn thành.")

# 3. KỸ THUẬT TRÍCH XUẤT ĐẶC TRƯNG RFM THỰC TẾ
print("\n[Bước 2] AI đang tiến hành gom nhóm và tính toán chỉ số RFM động...")
df_orders['orderDate'] = pd.to_datetime(df_orders['orderDate'])
current_date = datetime.now(df_orders['orderDate'].dt.tz)

# Gom nhóm theo từng User ID
rfm = df_orders.groupby('user').agg({
    'orderDate': lambda x: (current_date - x.max()).days, # Recency
    '_id': 'count',                                      # Frequency
    'totalAmount': 'sum'                                 # Monetary
}).rename(columns={'orderDate': 'Recency', '_id': 'Frequency', 'totalAmount': 'Monetary'})

num_users = len(rfm)
print(f"-> Tổng số tài khoản khách hàng phát sinh giao dịch: {num_users}")

# Điều kiện an toàn để thuật toán K-Means chạy (Số lượng khách hàng phải >= số cụm)
if num_users < 3:
    print("\n❌ CẢNH BÁO: Hiện tại database chỉ có dữ liệu của", num_users, "khách hàng.")
    print("Thuật toán K-Means yêu cầu tối thiểu 3 khách hàng khác nhau để chia thành 3 cụm (k=3).")
    print("Mẹo: Hãy đăng ký thêm tài khoản trên app và mua hàng để demo chuẩn xác nhất.")
    sys.exit()

# 4. CHUẨN HÓA DỮ LIỆU
print("\n[Bước 3] Chuẩn hóa thang đo dữ liệu (StandardScaler)...")
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm)

# 5. HUẤN LUYỆN MÔ HÌNH K-MEANS TRÊN DỮ LIỆU THẬT
print("[Bước 4] Khởi chạy bộ não K-Means học dữ liệu thực tế...")
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(rfm_scaled)
rfm['Cluster'] = kmeans.labels_

# 6. ĐỊNH DANH TỰ ĐỘNG PHÂN KHÚC THEO TÂM CỤM THẬT (BƯỚC QUAN TRỌNG VỪA BỊ THIẾU)
print("[Bước 5] Đang phân tích tâm cụm toán học để tự động gán nhãn phân khúc...")
cluster_means = rfm.groupby('Cluster').mean()
cluster_labels = {}

for cluster_id in cluster_means.index:
    mean_r = cluster_means.loc[cluster_id, 'Recency']
    mean_f = cluster_means.loc[cluster_id, 'Frequency']
    
    if mean_r == cluster_means['Recency'].max():
        cluster_labels[cluster_id] = "Dormant (Ngủ đông)"
    elif mean_f == cluster_means['Frequency'].max():
        cluster_labels[cluster_id] = "VIP (Thành viên bạc tỷ)"
    else:
        cluster_labels[cluster_id] = "Casual (Khách vãng lai)"

rfm['Segment'] = rfm['Cluster'].map(cluster_labels)

print("\n" + "="*50)
print(" BẢNG KẾT QUẢ PHÂN CỤM KHÁCH HÀNG REAL-TIME ")
print("="*50)
print(rfm[['Recency', 'Frequency', 'Monetary', 'Segment']].head(5))
print("="*50)

# 7. VẼ ĐỒ THỊ 3D KHÔNG GIAN THỰC TẾ TRÊN TRÌNH DUYỆT (PLOTLY)
print("\n[Bước 6] Đang dựng đồ thị không gian 3D tương tác trên trình duyệt...")

import plotly.express as px
import webbrowser
import os
import warnings

# Ẩn các cảnh báo hệ thống không cần thiết (bao gồm cảnh báo đếm nhân CPU)
warnings.filterwarnings("ignore")

# Reset index để biến cột 'user' (đang là index) thành 1 cột bình thường để vẽ lên biểu đồ
rfm_plot = rfm.reset_index()
rfm_plot['user'] = rfm_plot['user'].astype(str)

# Dựng biểu đồ 3D
fig = px.scatter_3d(
    rfm_plot,
    x='Recency',
    y='Frequency',
    z='Monetary',
    color='Segment',
    hover_data=['user'], # Tuyệt chiêu: Di chuột vào chấm sẽ hiện ID khách hàng!
    color_discrete_map={
        "VIP (Thành viên bạc tỷ)": '#FFD700', 
        "Casual (Khách vãng lai)": '#1E90FF', 
        "Dormant (Ngủ đông)": '#FF4500'
    },
    title='KHÔNG GIAN PHÂN CỤM AI KHÁCH HÀNG - DỰ ÁN FUZZY'
)

# Chỉnh sửa giao diện cho các chấm dữ liệu to và rõ nét hơn
fig.update_traces(marker=dict(size=8, line=dict(width=2, color='DarkSlateGrey')))
fig.update_layout(margin=dict(l=0, r=0, b=0, t=40)) # Căn lề đồ thị tràn viền

# Xuất ra file HTML và tự động dùng trình duyệt mở trực tiếp file đó
output_html = os.path.abspath("fuzzy_clusters.html")
fig.write_html(output_html)

# ============ BƯỚC MỚI: TÍNH TOÁN & DỰNG MA TRẬN TƯƠNG QUAN (FEATURE CORRELATION MATRIX) ============
print("\n[Bước 7] Đang tính toán ma trận tương quan giữa các đặc trưng RFM...")

# Tính toán ma trận tương quan hệ số Pearson
corr_matrix = rfm[['Recency', 'Frequency', 'Monetary']].corr()

# Dựng biểu đồ Heatmap tương tác bằng Plotly
fig_corr = px.imshow(
    corr_matrix,
    text_auto='.2f', # Hiển thị giá trị số tương quan làm tròn 2 chữ số thập phân
    aspect="auto",
    color_continuous_scale='RdBu_r', # Tone màu đỏ - xanh đối xứng chuyên nghiệp
    labels=dict(color="Mức độ tương quan"),
    x=['Recency (Gần đây)', 'Frequency (Tần suất)', 'Monetary (Chi tiêu)'],
    y=['Recency (Gần đây)', 'Frequency (Tần suất)', 'Monetary (Chi tiêu)'],
    title='MA TRẬN TƯƠNG QUAN ĐẶC TRƯNG RFM (FEATURE CORRELATION MATRIX)'
)

# Chỉnh sửa layout đẹp mắt, hiển thị lưới rõ nét
fig_corr.update_layout(
    margin=dict(l=50, r=50, b=50, t=80),
    coloraxis_colorbar=dict(title="Hệ số tương quan")
)

# Xuất ra file HTML cho biểu đồ tương quan
output_corr_html = os.path.abspath("fuzzy_correlation.html")
fig_corr.write_html(output_corr_html)

print("\n" + "="*60)
print(f"🎉 BIỂU ĐỒ 3D PHÂN CỤM: {output_html}")
print(f"🎉 MA TRẬN TƯƠNG QUAN:  {output_corr_html}")
print("  Trình duyệt của bạn đang được tự động kích hoạt cả 2 tab...")
print("="*60)

# Mở cả 2 file biểu đồ bằng trình duyệt mặc định của hệ thống
webbrowser.open(f"file:///{output_html}")
webbrowser.open(f"file:///{output_corr_html}")