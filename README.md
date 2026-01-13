# Fuzzy E-Commerce Mobile App

Ứng dụng mobile E-commerce được xây dựng với React Native và Expo.

## 🚀 Tính năng đã hoàn thành

### ✅ Màn hình đầu tiên (Initial Screens Flow)
1. **Splash Screen** - Màn hình chào đầu với logo Fuzzy và animation
2. **Onboarding Screens** - 3 màn hình giới thiệu tính năng chính:
   - Welcome to Fuzzy 🛍️
   - Secure Shopping 🔒
   - Fast Delivery 🚀
3. **Welcome Screen** - Màn hình chào mừng với các option:
   - Login
   - Sign Up
   - Continue as Guest

## 📱 Cài đặt và Chạy dự án

### Yêu cầu
- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn
- Expo Go app trên điện thoại (iOS/Android)

### Bước 1: Clone repository

```bash
git clone https://github.com/longcoderwebdev/MobileApp_Fuzzy_Final.git
cd MobileApp_Fuzzy_Final
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Chạy ứng dụng

```bash
npm start
```

Sau đó:
- Quét QR code bằng Expo Go app (Android)
- Hoặc quét bằng Camera app (iOS)

### Chạy trên emulator/simulator

```bash
# Android
npm run android

# iOS (chỉ trên macOS)
npm run ios
```

## 🎨 Thiết kế

### Màu sắc chủ đạo
- Primary: `#667eea` (Purple)
- Secondary: `#764ba2` (Dark Purple)
- Accent: `#f093fb` (Pink)
- Text: `#1f2937` (Dark Gray)

### Font
- Hệ thống mặc định với các weight: 400, 500, 600, 700, 800

## 📁 Cấu trúc dự án

```
PROJECT_Mobile_App/
├── app/
│   ├── (tabs)/          # Tab navigation screens
│   ├── index.tsx        # Splash screen (màn hình khởi động)
│   ├── onboarding.tsx   # Onboarding screens
│   ├── welcome.tsx      # Welcome/Login screen
│   ├── _layout.tsx      # Root layout và navigation config
│   └── modal.tsx        # Modal screen example
├── components/          # Reusable components
├── constants/           # App constants
├── assets/              # Images, fonts, etc.
└── hooks/              # Custom React hooks
```

## 🔄 Git Workflow

### Clone và làm việc

```bash
# Lấy code mới nhất
git pull origin master

# Tạo branch mới cho feature
git checkout -b feature/ten-feature

# Sau khi code xong
git add .
git commit -m "Mô tả chi tiết thay đổi"
git push origin feature/ten-feature
```

### Tạo Pull Request
1. Vào GitHub repository
2. Click "New Pull Request"
3. Chọn branch của bạn
4. Thêm description chi tiết
5. Request review từ team members

## 👥 Team Collaboration

### Branch Naming Convention
- `feature/` - Tính năng mới (vd: `feature/product-listing`)
- `bugfix/` - Sửa lỗi (vd: `bugfix/login-error`)
- `hotfix/` - Sửa lỗi khẩn cấp
- `refactor/` - Tái cấu trúc code

### Commit Message Format
```
<type>: <description>

[optional body]
```

Types:
- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Cập nhật documentation
- `style:` - Format code, không thay đổi logic
- `refactor:` - Refactor code
- `test:` - Thêm tests

## 🎯 Kế hoạch tiếp theo

### Screens cần build
- [ ] Home Screen (Trang chủ với danh sách sản phẩm)
- [ ] Product Detail Screen
- [ ] Shopping Cart Screen
- [ ] Checkout Screen
- [ ] User Profile Screen
- [ ] Order History Screen
- [ ] Search Screen
- [ ] Categories Screen

### Features cần implement
- [ ] Authentication (Login/Register)
- [ ] Product listing và filtering
- [ ] Add to cart functionality
- [ ] Payment integration
- [ ] Order tracking
- [ ] User reviews và ratings
- [ ] Wishlist
- [ ] Push notifications

## 📞 Liên hệ

Repository: https://github.com/longcoderwebdev/MobileApp_Fuzzy_Final

---

**Happy Coding! 🚀**
