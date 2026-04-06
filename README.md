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