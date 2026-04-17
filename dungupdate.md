<h1>Phân tích chức năng: Đăng ký, đăng nhập, quản lý các thư mục quyết định, quản lý các quyết định, đưa ra quyết định </h1>
I. CHỨC NĂNG: ĐĂNG KÝ (REGISTER)
1. Mô tả
Chức năng cho phép người dùng tạo tài khoản mới để truy cập hệ thống.
2. Actor
   Người dùng (User)
3. Tiền điều kiện (Pre-condition)
   Người dùng chưa đăng nhập
   Người dùng truy cập trang đăng ký
4. Hậu điều kiện (Post-condition)
   Thành công: tài khoản được lưu vào hệ thống
   Thất bại: không có dữ liệu nào được lưu
5. Luồng chính (Main Flow)
  - Người dùng chọn chức năng Đăng ký
  -  Hệ thống hiển thị form đăng ký
  - Người dùng nhập:
   Username
   Email
   Password
   Confirm Password
   Người dùng nhấn Submit
   - Hệ thống kiểm tra:
   Dữ liệu không rỗng
   Email đúng định dạng
   Password ≥ 6 ký tự
   Password = Confirm Password
    Hệ thống kiểm tra:
   Username chưa tồn tại
   Email chưa tồn tại
    -Hệ thống mã hóa password (hash)
    -Lưu user vào database
    -Trả thông báo Đăng ký thành công
6. Luồng thay thế (Alternative Flow)
   ❌ A1: Thiếu dữ liệu
   Nếu input trống → hiển thị lỗi: "Không được để trống"
   ❌ A2: Email sai định dạng
   Hiển thị: "Email không hợp lệ"
   ❌ A3: Password không khớp
   Hiển thị: "Mật khẩu không khớp"
   ❌ A4: Tài khoản đã tồn tại
   Hiển thị: "Username hoặc Email đã tồn tại"
7. Yêu cầu chức năng (Functional Requirements)
   FR-R1: Hệ thống cung cấp form đăng ký
   FR-R2: Hệ thống kiểm tra dữ liệu đầu vào
   FR-R3: Hệ thống kiểm tra trùng tài khoản
   FR-R4: Hệ thống mã hóa mật khẩu
   FR-R5: Hệ thống lưu thông tin vào DB
   FR-R6: Hệ thống trả thông báo kết quả
8. Yêu cầu phi chức năng (Non-functional Requirements)
   🔒 Bảo mật
   NFR-R1: Password phải được hash (bcrypt)
   NFR-R2: Không lưu password dạng plain text
   NFR-R3: Dữ liệu truyền qua HTTPS
   ⚡ Hiệu năng
   NFR-R4: Thời gian xử lý < 2 giây
   📈 Khả năng mở rộng
   NFR-R5: Hỗ trợ nhiều user đăng ký cùng lúc
   🎨 Usability
   NFR-R6: Giao diện dễ hiểu, thông báo rõ ràng
   🔑 II. CHỨC NĂNG: ĐĂNG NHẬP (LOGIN)
9. Mô tả

Cho phép người dùng truy cập hệ thống bằng tài khoản đã đăng ký.

2. Actor
   Người dùng (User)
3. Tiền điều kiện
   Người dùng đã có tài khoản
4. Hậu điều kiện
   Thành công: user đăng nhập và nhận token/session
   Thất bại: không tạo session
5. Luồng chính (Main Flow)
   Người dùng chọn Đăng nhập
   Hệ thống hiển thị form login
   Người dùng nhập:
   Username/Email
   Password
   Người dùng nhấn Login
   Hệ thống kiểm tra:
   Không để trống
   Hệ thống tìm user trong database
   So sánh password (hash)
   Nếu đúng:
   Tạo token (JWT) hoặc session
   Trả về client
   Hiển thị Đăng nhập thành công
6. Luồng thay thế (Alternative Flow)
   ❌ A1: Thiếu dữ liệu
   Hiển thị: "Vui lòng nhập đầy đủ thông tin"
   ❌ A2: Không tìm thấy user
   Hiển thị: "Tài khoản không tồn tại"
   ❌ A3: Sai mật khẩu
   Hiển thị: "Sai mật khẩu"
   ❌ A4: Bị khóa tài khoản
   Hiển thị: "Tài khoản bị khóa"
7. Yêu cầu chức năng (Functional Requirements)
   FR-L1: Hệ thống hiển thị form đăng nhập
   FR-L2: Hệ thống kiểm tra dữ liệu đầu vào
   FR-L3: Hệ thống xác thực tài khoản
   FR-L4: Hệ thống tạo token/session
   FR-L5: Hệ thống trả kết quả đăng nhập
8. Yêu cầu phi chức năng (Non-functional Requirements)
   🔒 Bảo mật
   NFR-L1: Password phải được mã hóa khi so sánh
   NFR-L2: Token phải có thời hạn (expiration)
   NFR-L3: Giới hạn số lần login sai (anti brute-force)
   ⚡ Hiệu năng
   NFR-L4: Thời gian phản hồi < 1–2 giây
   📈 Độ tin cậy
   NFR-L5: Hệ thống hoạt động ổn định khi nhiều user login
   🧠 Khả dụng
   NFR-L6: Thông báo lỗi rõ ràng, dễ hiểu
   🧩 III. RÀNG BUỘC HỆ THỐNG (System Constraints)
   Sử dụng database (MySQL/PostgreSQL)
   Backend: Node.js (Express)
   Authentication: JWT
   Password hashing: bcrypt
   🎯 IV. TÓM TẮT NGẮN (để bạn chép nhanh)
   Đăng ký: nhập → validate → check trùng → hash → lưu DB
   Đăng nhập: nhập → check → so sánh → tạo token
   Functional: xử lý đúng logic user
   Non-functional: bảo mật, nhanh, ổn định
