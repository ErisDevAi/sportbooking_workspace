# Decision Maker

"Ask & Do" – Hỏi và Làm

---

## 1. Giới thiệu

Decision Maker là một web application giúp người dùng ra quyết định hàng ngày thông qua cơ chế random / spin wheel.

Ứng dụng tập trung vào việc:
- Giảm thời gian suy nghĩ
- Tăng hành động thực tế
- Tạo thói quen thông qua streak và check-in

---

## 2. Core Value

### 2.1 Anti Overthinking
Giải quyết tình trạng "analysis paralysis" khi có quá nhiều lựa chọn.

### 2.2 Gamification
- Streak (chuỗi ngày)
- Level
- Thành tích

Giúp người dùng duy trì thói quen ra quyết định và hành động.

### 2.3 Social Proof
- Check-in bằng hình ảnh
- Chia sẻ trải nghiệm

Tạo động lực thực hiện quyết định.

---

## 3. Personas

### 3.1 Cá nhân
- Không biết ăn gì
- Không biết mặc gì
- Không biết làm gì

### 3.2 Nhóm bạn
- Chọn địa điểm đi chơi
- Chọn quán ăn

### 3.3 Couples
- Quyết định hẹn hò
- Tránh tranh luận

---

## 4. User Flow

Đặt câu hỏi  
→ Thêm lựa chọn  
→ Spin Wheel  
→ Nhận kết quả  
→ Thực hiện  
→ Check-in ảnh  
→ Streak + Level  

---

## 5. Ví dụ

"Ăn gì hôm nay?"  
→ Spin → "Bún bò"  
→ Đi ăn  
→ Chụp ảnh check-in  
→ Tăng streak  

---

## 6. Tính năng chính

- Random / Spin Wheel
- Quản lý danh sách lựa chọn
- Check-in bằng hình ảnh
- Streak tracking
- Level system

Planned:
- Social feed
- Group decision
- AI suggestion

---

## 7. Tech Stack

### Frontend
- Next.js (App Router)
- Ant Design
- TailwindCSS

### Backend
- Node.js
- Express
- MongoDB

---

## 8. Setup & Run

### 8.1 Cài dependencies

```bash
cd node-backend-with-cms-integration
npm install

cd ../frontend-nextjs-antd-tailwind
npm install