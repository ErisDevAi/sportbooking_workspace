<h1>Đặc tả Use Case chi tiết</h1>
<h1>UC10: Quay Spin Wheel(Use Case chính)</h1>
<table>
    <tr>
        <th>Thuộc tính</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td><b>Tên UC</b></td>
        <td>Quay Spin Wheel</td>
    </tr>
    <tr>
        <td><b>Tác nhân</b></td>
        <td>User</td>
    </tr>
    <tr>
        <td><b>Mô tả</b></td>
        <td>Người dùng chọn danh mục và quay vòng quay để nhận kết quả ngẫu nhiên</td>
    </tr>
    <tr>
        <td><b>Tiền điều kiện</b></td>
        <td>Đã đăng nhập, danh mục có ít nhất 2 lựa chọn active</td>
    </tr>
    <tr>
        <td><b>Hậu điều kiện</b></td>
        <td>Tạo Decision mới với trạng thái "pending"</td>
    </tr>
</table>
<table> 
    <tr>
        <th>Luồng chính (Main Flow)</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Tác nhân</th>
        <th>Hệ thống</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Chọn danh mục từ dropdown</td>
        <td>Tải danh sách lựa chọn thuộc danh mục</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Nhập câu hỏi tùy chọn</td>
        <td>Hiển thị vòng quay với các lựa chọn</td>
    </tr>
    <tr>
        <td>3<td>Nhấn nút "QUAY NGAY!"</td>
        <td>Gửi request spin đến API</td>
    </tr>
    <tr>
        <td>4</td>
        <td></td>
        <td>API thực hiện thuật toán random có trọng số</td>
    </tr>
    <tr>
        <td>5</td>
        <td></td>
        <td>Trả về kết quả (choiceId)</td>
    </tr>
    <tr>
        <td>6</td>
        <td></td>
        <td>Hiển thị animation quay 4 giây</td>
    </tr>
    <tr>
        <td>7</td>
        <td></td>
        <td>Hiển thị kết quả với confetti</td>
    </tr>
    <tr>
        <td>8</td>
        <td></td>
        <td>Nhấn "chấp nhận"</td>
        <td>Cập nhật Decision status, hiển thị nhiệm vụ</td>
    </tr>
</table>

<table>
    <tr>
        <th>Luồng thay thế</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td>8a</td>
        <td>Người dùng nhấn "Quay lại" để kiểm tra số lần re-spin còn lại(tối đa 2 lần/ngày). Nếu còn, quay lại bước 4</td>
    </tr>
    <tr>
        <td>8b</td>
        <td>Hết lượt re-spin: Hiển thị thông báo "đã hết lượt quay lại"</td>
    </tr>
</table>

<table>
    <tr>
        <th>Luồng ngoại lệ</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td>1a</td>
        <td>Danh mục ít hơn 2 lựa chọn:thông báo lỗi</td>
    </tr>
    <tr>
        <td>4a</td>
        <td>Lỗi server: hiển thị thông báo "Vui lòng thử lại"</td>
    </tr>
</table>  

<h1>UC13:Check-in</h1>

<table>
    <tr>
        <th>Thuộc tính</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td><b>Tên UC</b></td>
        <td>Check-in xác nhận hoàn thành</td>
    </tr>
    <tr>
        <td><b>Tác nhân</b></td>
        <td>User</td>
    </tr>
    <tr>
        <td><b>Mô tả</b></td>
        <td>Upload ảnh, đánh giá, xác nhận đã thực hiện quyết định</td>
    </tr>
    <tr>
        <td><b>Tiền điều kiện</b></td>
        <td>Có Decision ở trạng thái "pending", chưa quá hạn 24h</td>
    </tr>
    <tr>
        <td><b>Hậu điều kiện</b></td>
        <td>Decision chuyển sang "completed", cập nhật streak</td> 
</table>

<table>
    <tr>
        <th>Luồng chính</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Tác nhân</th>
        <th>Hệ thống</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Nhấn "Check-in ngay" từ dashboard</td>
        <td>Hiển thị form check-in với thông tin nhiệm vụ</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Chọn ảnh từ thiết bị hoặc chụp mới</td>
        <td>Preview ảnh đã chọn</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Dánh giá 1-5 sao</td>
        <td>Lưu đánh giá</td>
    </tr>
    <tr>
        <td>4</td>
        <td>Viết caption (tùy chọn)</td>
        <td></td>
    </tr>
    <tr>
        <td>5</td>
        <td>Nhấn "Hoàn thành Check-in"</td>
        <td>Upload ảnh, gửi dữ liệu đến API</td>
    </tr>
    <tr>
        <td>6</td>
        <td></td>
        <td>Cập nhật Decision.status = "completed"</td>
    </tr>
    <tr>
        <td>7</td>
        <td></td>
        <td>Cập nhật UserStreak (streak, level, badges)</td>
    </tr>
    <tr>
        <td>8</td>
        <td></td>
        <td>Hiển thị animation thành công + streak mới</td>
    </tr>
</table>

<h1>UC01: Đăng ký tài khoản</h1>

<table>
    <tr>
        <th>Thuộc tính</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td><b>Tên UC</b></td>
        <td>Đăng ký tài khoản</td>
    </tr>
    <tr>
        <td><b>Tác nhân</b></td>
        <td>Guest</td>
    </tr>
    <tr>
        <td><b>Mô tả</b></td>
        <td>Khách tạo tài khoản mới để sử dụng hệ thống</td>
    </tr>
    <tr>
        <td><b>Tiền điều kiện</b></td>
        <td>Chưa có tài khoản, truy cập trang /login</td>
    </tr>
    <tr>
        <td><b>Hậu điều kiện</b></td>
        <td>Tài khoản được tạo, nhận JWT token, redirect /dashboard</td>
    </tr>
</table>

<table>
    <tr>
        <th>Luồng chính</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Tác nhân</th>
        <th>Hệ thống</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Nhấn tab "Đăng ký"</td>
        <td>Hiển thị form đăng ký (tên, email, password)</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Nhập đầy đủ thông tin</td>
        <td>Validate client-side (tên >= 2 ký tự, email hợp lệ, password >= 6 ký tự)</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Nhấn "Đăng ký"</td>
        <td>POST /auth/register</td>
    </tr>
    <tr>
        <td>4</td>
        <td></td>
        <td>Kiểm tra email chưa tồn tại</td>
    </tr>
    <tr>
        <td>5</td>
        <td></td>
        <td>Hash password (bcrypt, 12 rounds)</td>
    </tr>
    <tr>
        <td>6</td>
        <td></td>
        <td>Tạo User (role: "viewer")</td>
    </tr>
    <tr>
        <td>7</td>
        <td></td>
        <td>Tạo JWT token</td>
    </tr>
    <tr>
        <td>8</td>
        <td></td>
        <td>Trả về {token, user}</td>
    </tr>
    <tr>
        <td>9</td>
        <td></td>
        <td>Lưu token vào localStorage, redirect /dashboard</td>
    </tr>
</table>

<table>
    <tr>
        <th>Luồng ngoại lệ</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td>4a</td>
        <td>Email đã tồn tại → 409 "Email đã được sử dụng"</td>
    </tr>
    <tr>
        <td>2a</td>
        <td>Dữ liệu không hợp lệ → 422 hiển thị lỗi validation</td>
    </tr>
</table>

<h1>UC02: Đăng nhập</h1>

<table>
    <tr>
        <th>Thuộc tính</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td><b>Tên UC</b></td>
        <td>Đăng nhập</td>
    </tr>
    <tr>
        <td><b>Tác nhân</b></td>
        <td>Guest</td>
    </tr>
    <tr>
        <td><b>Mô tả</b></td>
        <td>Xác thực bằng email/password để truy cập hệ thống</td>
    </tr>
    <tr>
        <td><b>Tiền điều kiện</b></td>
        <td>Đã có tài khoản</td>
    </tr>
    <tr>
        <td><b>Hậu điều kiện</b></td>
        <td>Nhận JWT token, redirect /dashboard</td>
    </tr>
</table>

<table>
    <tr>
        <th>Luồng chính</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Tác nhân</th>
        <th>Hệ thống</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Nhập email và password</td>
        <td></td>
    </tr>
    <tr>
        <td>2</td>
        <td>Nhấn "Đăng nhập"</td>
        <td>POST /auth/login</td>
    </tr>
    <tr>
        <td>3</td>
        <td></td>
        <td>Tìm user theo email</td>
    </tr>
    <tr>
        <td>4</td>
        <td></td>
        <td>So sánh password (bcrypt)</td>
    </tr>
    <tr>
        <td>5</td>
        <td></td>
        <td>Kiểm tra isActive == true</td>
    </tr>
    <tr>
        <td>6</td>
        <td></td>
        <td>Tra cứu role → lấy permissions[]</td>
    </tr>
    <tr>
        <td>7</td>
        <td></td>
        <td>Tạo JWT token (userId, email, role, permissions)</td>
    </tr>
    <tr>
        <td>8</td>
        <td></td>
        <td>Trả về {token, user}</td>
    </tr>
    <tr>
        <td>9</td>
        <td></td>
        <td>Lưu token, redirect /dashboard</td>
    </tr>
</table>

<table>
    <tr>
        <th>Luồng ngoại lệ</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td>3a</td>
        <td>Email không tồn tại → 401 "Email hoặc mật khẩu không chính xác"</td>
    </tr>
    <tr>
        <td>4a</td>
        <td>Password sai → 401 "Email hoặc mật khẩu không chính xác"</td>
    </tr>
    <tr>
        <td>5a</td>
        <td>Tài khoản bị vô hiệu hóa → 403 "Tài khoản đã bị khóa"</td>
    </tr>
</table>

<h3>UC03: Đăng xuất</h3>

<table>
    <tr>
        <th>Thuộc tính</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td><b>Tên UC</b></td>
        <td>Đăng xuất</td>
    </tr>
    <tr>
        <td><b>Tác nhân</b></td>
        <td>User, Admin</td>
    </tr>
    <tr>
        <td><b>Mô tả</b></td>
        <td>Kết thúc phiên đăng nhập</td>
    </tr>
    <tr>
        <td><b>Tiền điều kiện</b></td>
        <td>Đã đăng nhập</td>
    </tr>
    <tr>
        <td><b>Hậu điều kiện</b></td>
        <td>Token bị xóa, redirect /login</td>
    </tr>
</table>

<table>
    <tr>
        <th>Luồng chính</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Tác nhân</th>
        <th>Hệ thống</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Nhấn "Đăng xuất" trên sidebar</td>
        <td>Xóa token khỏi Zustand store + localStorage</td>
    </tr>
    <tr>
        <td>2</td>
        <td></td>
        <td>Redirect về /login</td>
    </tr>
</table>

<h3>UC05: Xem danh sách danh mục</h3>

<table>
    <tr>
        <th>Thuộc tính</th>
        <th>Mô tả</th>
    </tr>
    <tr>
        <td><b>Tên UC</b></td>
        <td>Xem danh sách danh mục</td>
    </tr>
    <tr>
        <td><b>Tác nhân</b></td>
        <td>User</td>
    </tr>
    <tr>
        <td><b>Mô tả</b></td>
        <td>Xem tất cả danh mục (mặc định + tự tạo + public)</td>
    </tr>
    <tr>
        <td><b>Tiền điều kiện</b></td>
        <td>Đã đăng nhập</td>
    </tr>
    <tr>
        <td><b>Hậu điều kiện</b></td>
        <td>Hiển thị danh sách danh mục</td>
    </tr>
</table>

<table>
    <tr>
        <th>Luồng chính</th>
    </tr>
    <tr>
        <th>Bước</th>
        <th>Tác nhân</th>
        <th>Hệ thống</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Mở trang /categories</td>
        <td>GET /categories</td>
    </tr>
    <tr>
        <td>2</td>
        <td></td>
        <td>Trả về danh mục: createdBy == userId HOẶC isPublic == true</td>
    </tr>
    <tr>
        <td>3</td>
        <td></td>
        <td>Sắp xếp: mặc định trước, theo tên</td>
    </tr>
    <tr>
        <td>4</td>
        <td></td>
        <td>Hiển thị grid cards với icon, color, choiceCount</td>
    </tr>
</table>

</body>
</html>

