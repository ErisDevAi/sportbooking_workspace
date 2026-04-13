Dự án “Decision Maker” - Ngô Đại
Mô tả ngăn
Website “Decision Maker” (giúp ra quyết định)
💡 Ý tưởng:
Nhập nhiều lựa chọn dựa trên danh mục ( quần áo, đồ ăn, thức uống, địa điểm )
Hệ thống random / spin chọn
Checkin bằng hình ảnh, dựa trên lựa trọn => giữ streak ask & do ( hỏi và làm )
👉 Ví dụ:
“Ăn gì hôm nay?” -> quay random ( bún bò ) -> mua bún bò ăn -> chụp báo cáo -> streak
Decision Maker - Product Specification Document

## 1. Tổng quan sản phẩm

**Decision Maker** là một web application giúp người dùng ra quyết định hàng ngày thông qua cơ chế random/spin wheel. Ứng dụng kết hợp gamification (streak tracking) và social proof (check-in bằng hình ảnh) để tạo động lực thực hiện quyết định.

### 1.1 Tagline

> "Hỏi và Làm" - Ask & Do

### 1.2 Core Value

- Giải quyết "analysis paralysis" - tình trạng không thể ra quyết định vì quá nhiều lựa chọn
- Gamify quá trình ra quyết định để tạo thói quen tích cực
- Xây dựng cộng đồng chia sẻ trải nghiệm

---

## 2. Personas & Use Cases

### 2.1 Persona chính

- **Người dùng cá nhân**: Khó quyết định ăn gì, mặc gì, đi đâu hàng ngày
- **Nhóm bạn**: Cùng quay và thực hiện thử thách
- **Couples**: Quyết định hẹn hò đi đâu, ăn gì

### 2.2 User Flow chính

```
Đặt câu hỏi → Chọn/Thêm lựa chọn → Quay Spin Wheel → Nhận kết quả
→ Thực hiện → Chụp ảnh Check-in → Giữ Streak → Lên level
```

# Để chạy thử

okok2

# 1. Cài dependencies cho backend và frontend

cd node-backend-with-cms-integration && npm install
cd ../frontend-nextjs-antd-tailwind && npm install

# 2. Start MongoDB (nếu chưa chạy - yêu cầu mở terminal mới)

# mongod

# 3. Seed data cho backend (để có dữ liệu mẫu)

cd ../node-backend-with-cms-integration && npm run seed

# 4. Start backend (mặc định port 8000)

npm run dev

# 5. Start frontend (mặc định port 3000) - Mở terminal khác

# cd ../frontend-nextjs-antd-tailwind && npm run dev

### 2.2 User Flow chính

```
Đặt câu hỏi → Chọn/Thêm lựa chọn → Quay Spin Wheel → Nhận kết quả
→ Thực hiện → Chụp ảnh Check-in → Giữ Streak → Lên level
```
