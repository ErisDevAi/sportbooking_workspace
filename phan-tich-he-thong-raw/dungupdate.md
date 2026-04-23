<h1>Phân tích chức năng: Đăng ký, đăng nhập, quản lý các thư mục quyết định, quản lý các quyết định, đưa ra quyết định </h1>
<h2>Đăng ký (Register)</h2>

<div class="section">
  <h3>1. Mô tả</h3>
  <p>Chức năng cho phép người dùng tạo tài khoản mới để truy cập hệ thống.</p>
</div>

<div class="section">
  <h3>2. Actor</h3>
  <p><span class="label">Người dùng (User)</span></p>
</div>

<div class="section">
  <h3>3. Tiền điều kiện (Pre-condition)</h3>
  <ul>
    <li>Người dùng chưa đăng nhập</li>
    <li>Người dùng truy cập trang đăng ký</li>
  </ul>
</div>

<div class="section">
  <h3>4. Hậu điều kiện (Post-condition)</h3>
  <ul>
    <li><span class="success">Thành công:</span> Tài khoản được lưu vào hệ thống</li>
    <li><span class="error">Thất bại:</span> Không có dữ liệu nào được lưu</li>
  </ul>
</div>

<div class="section">
  <h3>5. Luồng chính (Main Flow)</h3>
  <ol>
    <li>Người dùng chọn chức năng <b>Đăng ký</b></li>
    <li>Hệ thống hiển thị form đăng ký</li>
    <li>Người dùng nhập:
      <ul>
        <li>Username</li>
        <li>Email</li>
        <li>Password</li>
        <li>Confirm Password</li>
      </ul>
    </li>
    <li>Người dùng nhấn <b>Submit</b></li>
    <li>Hệ thống kiểm tra dữ liệu hợp lệ</li>
    <li>Hệ thống kiểm tra trùng tài khoản</li>
    <li>Mã hóa mật khẩu (hash)</li>
    <li>Lưu vào database</li>
    <li>Hiển thị thông báo <span class="success">Đăng ký thành công</span></li>
  </ol>
</div>

<div class="section">
  <h3>6. Luồng thay thế (Alternative Flow)</h3>
  <ul>
    <li class="error">A1: Thiếu dữ liệu → "Không được để trống"</li>
    <li class="error">A2: Email không hợp lệ → "Email không hợp lệ"</li>
    <li class="error">A3: Mật khẩu không khớp → "Mật khẩu không khớp"</li>
    <li class="error">A4: Tài khoản đã tồn tại → "Username hoặc Email đã tồn tại"</li>
  </ul>
</div>

<div class="section">
  <h3>7. Yêu cầu chức năng (Functional Requirements)</h3>
  <ul>
    <li>FR-R1: Cung cấp form đăng ký</li>
    <li>FR-R2: Kiểm tra dữ liệu đầu vào</li>
    <li>FR-R3: Kiểm tra trùng tài khoản</li>
    <li>FR-R4: Mã hóa mật khẩu</li>
    <li>FR-R5: Lưu dữ liệu vào database</li>
    <li>FR-R6: Trả thông báo kết quả</li>
  </ul>
</div>

<div class="section">
  <h3>8. Yêu cầu phi chức năng (Non-functional Requirements)</h3>

  <h4> Bảo mật</h4>
  <ul>
    <li>Password phải được hash (bcrypt)</li>
    <li>Không lưu password dạng plain text</li>
    <li>Dữ liệu truyền qua HTTPS</li>
  </ul>

  <h4> Hiệu năng</h4>
  <ul>
    <li>Thời gian xử lý &lt; 2 giây</li>
  </ul>

  <h4> Khả năng mở rộng</h4>
  <ul>
    <li>Hỗ trợ nhiều user đăng ký cùng lúc</li>
  </ul>

  <h4> Khả dụng (Usability)</h4>
  <ul>
    <li>Giao diện dễ hiểu, thông báo rõ ràng</li>
  </ul>
</div>
<hr>
<h1>Chức năng đăng nhập</h1>
<div class="card">
  <h2>1. Mô tả</h2>
  <p>Cho phép người dùng truy cập hệ thống bằng tài khoản đã đăng ký.</p>
</div>

<div class="card">
  <h2>2. Actor</h2>
  <span class="tag">Người dùng (User)</span>
</div>

<div class="card">
  <h2>3. Tiền điều kiện</h2>
  <ul>
    <li>Người dùng đã có tài khoản</li>
  </ul>
</div>

<div class="card">
  <h2>4. Hậu điều kiện</h2>
  <ul>
    <li><span class="success">Thành công:</span> Nhận token/session</li>
    <li><span class="error">Thất bại:</span> Không tạo session</li>
  </ul>
</div>

<div class="card">
  <h2>5. Luồng chính (Main Flow)</h2>
  <ol>
    <li>Chọn <b>Đăng nhập</b></li>
    <li>Hiển thị form login</li>
    <li>Nhập:
      <ul>
        <li>Username/Email</li>
        <li>Password</li>
      </ul>
    </li>
    <li>Nhấn <b>Login</b></li>
    <li>Kiểm tra dữ liệu không rỗng</li>
    <li>Tìm user trong database</li>
    <li>So sánh password (hash)</li>
    <li>Nếu đúng:
      <ul>
        <li>Tạo token (JWT) / session</li>
        <li>Trả về client</li>
        <li><span class="success">Đăng nhập thành công</span></li>
      </ul>
    </li>
  </ol>
</div>

<div class="card">
  <h2>6. Luồng thay thế (Alternative Flow)</h2>
  <ul>
    <li class="error">A1: Thiếu dữ liệu → "Vui lòng nhập đầy đủ thông tin"</li>
    <li class="error">A2: Không tìm thấy user → "Tài khoản không tồn tại"</li>
    <li class="error">A3: Sai mật khẩu → "Sai mật khẩu"</li>
    <li class="error">A4: Bị khóa → "Tài khoản bị khóa"</li>
  </ul>
</div>

<div class="card">
  <h2>7. Functional Requirements</h2>
  <ul>
    <li>FR-L1: Hiển thị form đăng nhập</li>
    <li>FR-L2: Kiểm tra dữ liệu</li>
    <li>FR-L3: Xác thực tài khoản</li>
    <li>FR-L4: Tạo token/session</li>
    <li>FR-L5: Trả kết quả</li>
  </ul>
</div>

<div class="card">
  <h2>8. Non-functional Requirements</h2>

  <p><b> Bảo mật</b></p>
  <ul>
    <li>Password được mã hóa</li>
    <li>Token có thời hạn</li>
    <li>Giới hạn login sai</li>
  </ul>

  <p><b> Hiệu năng</b></p>
  <ul>
    <li>&lt; 2 giây</li>
  </ul>

  <p><b> Độ tin cậy</b></p>
  <ul>
    <li>Ổn định khi nhiều user</li>
  </ul>

  <p><b> Khả dụng</b></p>
  <ul>
    <li>Thông báo rõ ràng</li>
  </ul>

</div>

<div class="card">
  <h2>9. Ràng buộc hệ thống</h2>
  <ul>
    <li>Database: MySQL / PostgreSQL</li>
    <li>Backend: Node.js (Express)</li>
    <li>JWT Authentication</li>
    <li>Bcrypt hashing</li>
  </ul>
</div>

<div class="card">
  <h2>10. Tóm tắt</h2>
  <ul>
    <li>Đăng nhập: nhập → kiểm tra → xác thực → tạo token</li>
    <li>Functional: xử lý logic</li>
    <li>Non-functional: bảo mật, nhanh, ổn định</li>
  </ul>
</div>

<hr>
<h1>CHỨC NĂNG: QUẢN LÝ THƯ MỤC</h1>

<div class="card">
  <h2>1. Mô tả</h2>
  <p>Cho phép người dùng tạo và quản lý các thư mục để phân loại các quyết định theo từng chủ đề như ăn uống, giải trí, học tập...</p>
</div>

<div class="card">
  <h2>2. Actor</h2>
  <span class="tag">Người dùng (User)</span>
</div>

<div class="card">
  <h2>3. Tiền điều kiện</h2>
  <ul>
    <li>Người dùng đã đăng nhập hệ thống</li>
  </ul>
</div>

<div class="card">
  <h2>4. Hậu điều kiện</h2>
  <ul>
    <li><span class="success">Thành công:</span> Thư mục được lưu/cập nhật/xóa</li>
    <li><span class="error">Thất bại:</span> Không thay đổi dữ liệu</li>
  </ul>
</div>

<div class="card">
  <h2>5. Chức năng chính</h2>
  <ul>
    <li>Tạo thư mục mới</li>
    <li>Xem danh sách thư mục</li>
    <li>Chỉnh sửa thư mục</li>
    <li>Xóa thư mục</li>
  </ul>
</div>

<div class="card">
  <h2>6. Luồng chính (Tạo thư mục)</h2>
  <ol>
    <li>Chọn <b>Tạo thư mục</b></li>
    <li>Hiển thị form nhập</li>
    <li>Nhập tên thư mục</li>
    <li>Nhấn <b>Lưu</b></li>
    <li>Hệ thống kiểm tra dữ liệu</li>
    <li>Lưu vào database</li>
    <li>Hiển thị danh sách</li>
  </ol>
</div>

<div class="card">
  <h2>7. Luồng chính (Sửa thư mục)</h2>
  <ol>
    <li>Chọn <b>Sửa</b></li>
    <li>Nhập tên mới</li>
    <li>Kiểm tra hợp lệ</li>
    <li>Cập nhật database</li>
  </ol>
</div>

<div class="card">
  <h2>8. Luồng chính (Xóa thư mục)</h2>
  <ol>
    <li>Chọn <b>Xóa</b></li>
    <li>Xác nhận</li>
    <li>Xóa khỏi database</li>
  </ol>
</div>

<div class="card">
  <h2>9. Luồng thay thế</h2>
  <ul>
    <li class="error">A1: Tên rỗng → "Không được để trống"</li>
    <li class="error">A2: Trùng tên → "Thư mục đã tồn tại"</li>
    <li class="error">A3: Lỗi hệ thống → "Vui lòng thử lại"</li>
    <li class="error">A4: Xóa có dữ liệu → "Bạn có chắc chắn?"</li>
  </ul>
</div>

<div class="card">
  <h2>10. Functional Requirements</h2>
  <ul>
    <li>FR-F1: Tạo thư mục</li>
    <li>FR-F2: Hiển thị danh sách</li>
    <li>FR-F3: Chỉnh sửa</li>
    <li>FR-F4: Xóa</li>
    <li>FR-F5: Validate dữ liệu</li>
  </ul>
</div>

<div class="card">
  <h2>11. Non-functional Requirements</h2>

  <p><b>Bảo mật</b></p>
  <ul>
    <li>Chỉ user đăng nhập được thao tác</li>
  </ul>

  <p><b> Hiệu năng</b></p>
  <ul>
    <li>&lt; 1 giây</li>
  </ul>

  <p><b> Mở rộng</b></p>
  <ul>
    <li>Hỗ trợ nhiều user</li>
  </ul>

  <p><b> Khả dụng</b></p>
  <ul>
    <li>Giao diện đơn giản, dễ dùng</li>
  </ul>

</div>

<div class="card">
  <h2>12. Ràng buộc hệ thống</h2>
  <ul>
    <li>Node.js (Express)</li>
    <li>MySQL</li>
    <li>JWT Authentication</li>
  </ul>
</div>

</div>
<hr>
<h1> CHỨC NĂNG: QUẢN LÝ QUYẾT ĐỊNH</h1>

<div class="card">
  <h2>1. Mô tả</h2>
  <p>Cho phép người dùng thêm, chỉnh sửa và quản lý các lựa chọn (quyết định) trong từng thư mục.</p>
</div>

<div class="card">
  <h2>2. Actor</h2>
  <span class="tag">Người dùng (User)</span>
</div>

<div class="card">
  <h2>3. Tiền điều kiện</h2>
  <ul>
    <li>Người dùng đã đăng nhập</li>
    <li>Đã có ít nhất một thư mục</li>
  </ul>
</div>

<div class="card">
  <h2>4. Hậu điều kiện</h2>
  <ul>
    <li><span class="success">Thành công:</span> Quyết định được lưu/cập nhật/xóa</li>
    <li><span class="error">Thất bại:</span> Không thay đổi dữ liệu</li>
  </ul>
</div>

<div class="card">
  <h2>5. Chức năng chính</h2>
  <ul>
    <li>Thêm quyết định</li>
    <li>Xem danh sách quyết định</li>
    <li>Chỉnh sửa quyết định</li>
    <li>Xóa quyết định</li>
  </ul>
</div>

<div class="card">
  <h2>6. Luồng chính (Thêm quyết định)</h2>
  <ol>
    <li>Chọn thư mục</li>
    <li>Nhấn <b>Thêm quyết định</b></li>
    <li>Nhập nội dung</li>
    <li>Nhấn <b>Lưu</b></li>
    <li>Hệ thống kiểm tra dữ liệu</li>
    <li>Lưu vào database</li>
    <li>Hiển thị danh sách</li>
  </ol>
</div>

<div class="card">
  <h2>7. Luồng chính (Sửa quyết định)</h2>
  <ol>
    <li>Chọn <b>Sửa</b></li>
    <li>Nhập nội dung mới</li>
    <li>Kiểm tra hợp lệ</li>
    <li>Cập nhật database</li>
  </ol>
</div>

<div class="card">
  <h2>8. Luồng chính (Xóa quyết định)</h2>
  <ol>
    <li>Chọn <b>Xóa</b></li>
    <li>Xác nhận</li>
    <li>Xóa khỏi database</li>
  </ol>
</div>

<div class="card">
  <h2>9. Luồng thay thế</h2>
  <ul>
    <li class="error">A1: Nội dung rỗng → "Không được để trống"</li>
    <li class="error">A2: Trùng nội dung → "Đã tồn tại"</li>
    <li class="error">A3: Lỗi hệ thống → "Vui lòng thử lại"</li>
  </ul>
</div>

<div class="card">
  <h2>10. Functional Requirements</h2>
  <ul>
    <li>FR-D1: Thêm quyết định</li>
    <li>FR-D2: Hiển thị danh sách</li>
    <li>FR-D3: Chỉnh sửa</li>
    <li>FR-D4: Xóa</li>
    <li>FR-D5: Validate dữ liệu</li>
  </ul>
</div>

<div class="card">
  <h2>11. Non-functional Requirements</h2>

  <p><b> Bảo mật</b></p>
  <ul>
    <li>Chỉ user đăng nhập được thao tác</li>
  </ul>

  <p><b> Hiệu năng</b></p>
  <ul>
    <li>&lt; 1 giây</li>
  </ul>

  <p><b> Mở rộng</b></p>
  <ul>
    <li>Hỗ trợ nhiều user</li>
  </ul>

  <p><b> Khả dụng</b></p>
  <ul>
    <li>Giao diện dễ hiểu</li>
  </ul>

</div>

<div class="card">
  <h2>12. Ràng buộc hệ thống</h2>
  <ul>
    <li>Node.js (Express)</li>
    <li>MySQL</li>
    <li>JWT Authentication</li>
  </ul>
</div>

</div>
<hr>
<h1> CHỨC NĂNG: QUYẾT ĐỊNH GIÚP TÔI</h1>

<div class="card">
  <h2>1. Mô tả</h2>
  <p>Hệ thống hỗ trợ người dùng lựa chọn nhanh bằng cách chọn ngẫu nhiên một quyết định từ danh sách.</p>
</div>

<div class="card">
  <h2>2. Chức năng chính</h2>
  <ul style="text-align:left">
    <li>Chọn ngẫu nhiên quyết định</li>
    <li>Hiển thị kết quả</li>
    <li>Có hiệu ứng “quay” tạo trải nghiệm thú vị</li>
  </ul>
</div>
<!--  -->
<h1>Ma trận actor x Các chức năng (CRUD MATRIX)</h1>

<table>
  <thead>
    <tr>
      <th align="left">Chức năng</th>
      <th align="center">Guest</th>
      <th align="left">User (viewer)</th>
      <th align="left">Admin</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><b>Đăng ký</b></td><td>C</td><td>-</td><td>-</td></tr>
    <tr><td><b>Đăng nhập</b></td><td>R</td><td>-</td><td>-</td></tr>
    <tr><td><b>Đăng xuất</b></td><td>-</td><td>✓</td><td>✓</td></tr>
    <tr><td><b>Xem profile</b></td><td>-</td><td>R</td><td>R</td></tr>
    <tr><td><b>Danh mục</b></td><td>-</td><td>C R U D (own)</td><td>C R U D (all)</td></tr>
    <tr><td><b>Lựa chọn</b></td><td>-</td><td>C R U D (own)</td><td>C R U D (all)</td></tr>
    <tr><td><b>Quay Spin</b></td><td>-</td><td>C</td><td>C</td></tr>
    <tr><td><b>Chấp nhận/Bỏ qua</b></td><td>-</td><td>U (own)</td><td>U (own)</td></tr>
    <tr><td><b>Check-in</b></td><td>-</td><td>C (own)</td><td>C (own)</td></tr>
    <tr><td><b>Xem lịch sử</b></td><td>-</td><td>R (own)</td><td>R (own)</td></tr>
    <tr><td><b>Xem streak</b></td><td>-</td><td>R (own)</td><td>R (own)</td></tr>
    <tr><td><b>Xem leaderboard</b></td><td>-</td><td>R</td><td>R</td></tr>
    <tr><td><b>Quản lý users</b></td><td>-</td><td>-</td><td>C R U D</td></tr>
    <tr><td><b>Quản lý roles</b></td><td>-</td><td>-</td><td>C R U D</td></tr>
    <tr><td><b>Dashboard stats</b></td><td>-</td><td>-</td><td>R</td></tr>
  </tbody>
</table>
<h1> USECASE Check in - Streak </h1>
