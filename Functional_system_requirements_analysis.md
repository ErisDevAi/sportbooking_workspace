1. Mục tiêu hệ thống<br>

Hệ thống “Decision Maker” được xây dựng nhằm giúp người dùng quyết định nhanh chóng, giảm trạng thái “phân tích tê liệt” (quá nhiều lựa chọn → không chọn được) .<br>

Hệ thống tập tin vào công việc:<br>

Lướt ra mẹo nhanh (gợi ý tức thì)<br>
Hỗ trợ lọc theo ngữ cảnh thông tin<br>
Tạo trải nghiệm đơn giản – thú vị – có tính lặp lại (hình thành thói quen)<br>

Khác với nền tảng phát trực tiếp (tập trung vào nội dung & tương tác), hệ thống này tập trung vào:<br>
 quyết định cá nhân + tốc độ + trải nghiệm UX<br>

tiêu chính:<br>
Giúp người dùng quyết định trong một số giây<br>
Cung cấp mẹo ý phù hợp theo ngữ cảnh (nhận biết ngữ cảnh)<br>
Tạo trải nghiệm gamification (ngẫu nhiên, quay, theo chuỗi)<br>
Cho phép lưu trữ & tái sử dụng theo quyết định<br>
Xây dựng thói quen: “Hỏi → Chọn → Làm”<br>
2. Đối tượng sử dụng<br>
1. Người dùng khách<br>
Không cần đăng nhập<br>
Chỉ cần chọn sử dụng:<br>
Ngẫu nhiên<br>
Xem chi<br>

👉 Đây là luồng quan trọng nhất (điểm vào)<br>

2. Người dùng (Hoàn đăng nhập)<br>
Lưu yêu thích<br>
Bảo vệ vật liệu cao<br>
Theo dõi lịch sử đã được quyết định<br>
Trải nghiệm cá nhân hóa<br>
3. Quản trị viên<br>
Quản lý danh sách mũi ý (món ăn, hoạt động)<br>
Quản lý danh mục, thẻ<br>
Kiểm duyệt nội dung<br>
Theo dõi hệ thống phân tích<br>
3. Phạm vi hệ thống<br>
Trong cách vi:<br>
Mẹo ngẫu nhiên (tính năng cốt lõi)<br>
Lọc theo:<br>
Ngân hàng<br>
Thời gian<br>
Tâm trí<br>
Bối cảnh (một mình / hai người / nhóm)<br>
Trang chi<br>
Yêu thích<br>
Xác thực (email / Google)<br>
Dữ liệu CRUD gợi ý<br>
Theo dõi hành vi người dùng<br>
Ngoài phạm vi (giai đoạn đầu):<br>
AI đề xuất phức tạp<br>
Mạng xã hội (bình luận, theo dõi)<br>
Thanh toán / kiếm tiền<br>
Ứng dụng gốc trên thiết bị di động<br>

MÔ TẢ NGHIỆP VỤ (DÒNG KINH DOANH)<br>
1. Luồng 1 – Quyết định nhanh (Luồng cốt lõi)<br>
User vào web<br>
→ Chọn “Ăn gì” / “Làm gì”<br>
→ System random<br>
→ Hiển thị kết quả<br>
→ User chọn hoặc retry<br>

2. Luồng 2 – Quyết định lọc<br>
User chọn category<br>
→ Áp dụng filter<br>
→ System query data<br>
→ Trả danh sách phù hợp<br>
→ User chọn 1<br>

3. Luồng 3 – Chi tiết quyết định<br>
User click item<br>
→ Xem chi tiết<br>
→ Quyết định:<br>
   - Chọn<br>
   - Hoặc quay lại<br>

4. Luồng 4 – Yêu thích<br>
User login<br>
→ Click ❤️<br>
→ Save vào DB<br>
→ Xem lại sauv