1. Mục tiêu hệ thống<br>

    -Hệ thống “Decision Maker” được xây dựng nhằm giúp người dùng quyết định nhanh chóng, giảm trạng thái “phân tích tê liệt” (quá nhiều lựa chọn → không chọn được) .<br>

    -Hệ thống tập tin vào công việc:<br>

    -Lướt ra mẹo nhanh (gợi ý tức thì)<br>
    -Hỗ trợ lọc theo ngữ cảnh thông tin<br>
    -Tạo trải nghiệm đơn giản – thú vị – có tính lặp lại (hình thành thói quen)<br>

    -Khác với nền tảng phát trực tiếp (tập trung vào nội dung & tương tác), hệ thống này tập trung vào:<br>
    quyết định cá nhân + tốc độ + trải nghiệm UX<br>

    -Mục tiêu chính:<br>
        +Giúp người dùng quyết định trong một số giây<br>
        +Cung cấp mẹo ý phù hợp theo ngữ cảnh (nhận biết ngữ cảnh)<br>
        +Tạo trải nghiệm gamification (ngẫu nhiên, quay, theo chuỗi)<br>
        +Cho phép lưu trữ & tái sử dụng theo quyết định<br>
        +Xây dựng thói quen: “Hỏi → Chọn → Làm”<br>
2. Đối tượng sử dụng<br>
    1. Người dùng khách<br>
        -Không cần đăng nhập<br>
        -Chỉ cần chọn sử dụng:<br>
        -Ngẫu nhiên<br>
        -Xem chi<br>

        -Đây là luồng quan trọng nhất (điểm vào)<br>    

    2. Người dùng (Hoàn đăng nhập)<br>
        -Lưu yêu thích<br>
        -Bảo vệ vật liệu cao<br>
        -Theo dõi lịch sử đã được quyết định<br>
        -Trải nghiệm cá nhân hóa<br>
    3. Quản trị viên<br>
        -Quản lý danh sách mũi ý (món ăn, hoạt động)<br>
        -Quản lý danh mục, thẻ<br>
        -Kiểm duyệt nội dung<br>
        -Theo dõi hệ thống phân tích<br>
3. Phạm vi hệ thống<br>
    -Trong cách vi:<br>
    -Mẹo ngẫu nhiên (tính năng cốt lõi)<br>
    -Lọc theo:<br>
    -Ngân hàng<br>
    -Thời gian<br>
    -Tâm trí<br>
    -Bối cảnh (một mình / hai người / nhóm)<br>
    -Trang chi<br>
    -Yêu thích<br>
    -Xác thực (email / Google)<br>
    -Dữ liệu CRUD gợi ý<br>
    -Theo dõi hành vi người dùng<br>
    -Ngoài phạm vi (giai đoạn đầu):<br>
    -AI đề xuất phức tạp<br>
    -Mạng xã hội (bình luận, theo dõi)<br>
    -Thanh toán / kiếm tiền<br>
    -Ứng dụng gốc trên thiết bị di động<br>

4.MÔ TẢ NGHIỆP VỤ (DÒNG KINH DOANH)<br>
    1. Luồng 1 – Quyết định nhanh (Luồng cốt lõi)<br>
        Người dùng vào web <br>
        → Chọn “Ăn gì” / “Làm gì” <br>
        → Hệ thống ngẫu nhiên <br>
        → Hiển thị kết quả <br>
        → Người dùng chọn hoặc thử lại<br>
    2.Luồng 2 – Quyết định lọc<br>
        Danh mục lựa chọn của người dùng <br>
        → Áp dụng bộ lọc <br>
        → Dữ liệu truy vấn hệ thống <br>
        → Trả lại danh sách phù hợp <br>
        → Lựa chọn của người dùng 1<br>
    3. Luồng 3 – Chi tiết quyết định<br>
        Người dùng click vào mục <br>
        → Xem chi tiết <br>
        → Quyết định: <br>
        - Chọn <br>
        - hoặc quay lại<br>
    4. Luồng 4 – Yêu thích<br>
        User login <br>
        → Click  <br>
        → Save to DB <br>
        → Xem lại sau<br>


<h2>1. Ma trận phân quyền RBAC</h2>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Permission Slug</th>
      <th>Viewer</th>
      <th>Editor</th>
      <th>Admin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>view_user</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>create_user</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>edit_user</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>delete_user</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>manage_roles</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>manage_permissions</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>view_dashboard</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

<p>
Tất cả user (viewer, editor, admin) đều có quyền: CRUD category/choice (own), 
spin, check-in, xem streak/history.<br>
Chỉ admin mới có các permission đặc biệt ở bảng trên.
</p>


<h2>2. DFD Mức 0 (Context Diagram)</h2>


<p>
Sơ đồ mức 0 thể hiện hệ thống Decision Maker như một process duy nhất,
tương tác với 3 tác nhân bên ngoài (Guest, User, Admin).
</p>

<h3>Các luồng dữ liệu chính:</h3>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Từ</th>
      <th>Đến</th>
      <th>Dữ liệu</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Guest</td>
      <td>Hệ thống</td>
      <td>Thông tin đăng ký/đăng nhập (name, email, password)</td>
    </tr>
    <tr>
      <td>Hệ thống</td>
      <td>Guest</td>
      <td>JWT token, thông tin user, thông báo lỗi</td>
    </tr>
    <tr>
      <td>User</td>
      <td>Hệ thống</td>
      <td>Spin request, ảnh check-in, dữ liệu CRUD</td>
    </tr>
    <tr>
      <td>Hệ thống</td>
      <td>User</td>
      <td>Kết quả spin, streak/badge, lịch sử, bảng xếp hạng</td>
    </tr>
    <tr>
      <td>Admin</td>
      <td>Hệ thống</td>
      <td>CRUD users/roles/permissions</td>
    </tr>
    <tr>
      <td>Hệ thống</td>
      <td>Admin</td>
      <td>Dashboard thống kê, danh sách users</td>
    </tr>
  </tbody>
</table>


<h2>3. DFD Mức 1 (Phân rã)</h2>


<p>Hệ thống được phân rã thành 7 tiến trình con:</p>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Process</th>
      <th>Tên</th>
      <th>Mô tả</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.0</td>
      <td>Xác thực & Phân quyền</td>
      <td>Đăng ký, đăng nhập, JWT, RBAC</td>
    </tr>
    <tr>
      <td>2.0</td>
      <td>Quản lý Danh mục</td>
      <td>CRUD categories, slug generation</td>
    </tr>
    <tr>
      <td>3.0</td>
      <td>Quản lý Lựa chọn</td>
      <td>CRUD choices, weight management</td>
    </tr>
    <tr>
      <td>4.0</td>
      <td>Quay Spin & Quyết định</td>
      <td>Smart random, accept/skip, history</td>
    </tr>
    <tr>
      <td>5.0</td>
      <td>Check-in & Upload</td>
      <td>Upload ảnh, rating, cập nhật decision</td>
    </tr>
    <tr>
      <td>6.0</td>
      <td>Streak & Gamification</td>
      <td>Tính streak, level, badges, leaderboard</td>
    </tr>
    <tr>
      <td>7.0</td>
      <td>Quản trị hệ thống</td>
      <td>CRUD users/roles, dashboard stats</td>
    </tr>
  </tbody>
</table>

<h3>Các kho dữ liệu:</h3>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Ký hiệu</th>
      <th>Tên</th>
      <th>Mô tả</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>D1</td>
      <td>Users</td>
      <td>Thông tin người dùng</td>
    </tr>
    <tr>
      <td>D2</td>
      <td>Categories</td>
      <td>Danh mục lựa chọn</td>
    </tr>
    <tr>
      <td>D3</td>
      <td>Choices</td>
      <td>Các lựa chọn trong danh mục</td>
    </tr>
    <tr>
      <td>D4</td>
      <td>Decisions</td>
      <td>Quyết định (spin results + check-in)</td>
    </tr>
    <tr>
      <td>D5</td>
      <td>UserStreaks</td>
      <td>Dữ liệu streak, level, badges</td>
    </tr>
    <tr>
      <td>D6</td>
      <td>Roles & Permissions</td>
      <td>Vai trò và quyền hạn</td>
    </tr>
    <tr>
      <td>D7</td>
      <td>File Storage</td>
      <td>Ảnh check-in (/uploads)</td>
    </tr>
  </tbody>
</table>
