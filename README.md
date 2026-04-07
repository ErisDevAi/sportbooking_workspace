Dự án “Decision Maker”
Mô tả ngăn
Website “Decision Maker” (giúp ra quyết định)
💡 Ý tưởng:
Nhập nhiều lựa chọn dựa trên danh mục ( quần áo, đồ ăn, thức uống, địa điểm )
Hệ thống random / spin chọn 
Checkin bằng hình ảnh, dựa trên lựa trọn => giữ streak ask & do ( hỏi và làm )
👉 Ví dụ:
“Ăn gì hôm nay?”  -> quay random ( bún bò ) -> mua bún bò ăn -> chụp báo cáo -> streak
# Để chạy thử

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