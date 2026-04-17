<h1>1.Use-case:Đăng ký tài khoản</h1>
Tác nhân:người dùng
Mô tả:Cho phép người dùng tạo tài khoản mới để sử dụng hệ thống hỗ trợ đưa ra quyết định
Điều kiện: Người dùng chưa có tài khoản trong hệ thống

# Luồng chính
1.Người dùng chọn chức năng Đăng ký
2.Hệ thống hiển thị form đăng ký
3.Người dùng nhập thông tin:
    .Tên đăng nhập
    .Mật khẩu
    .Xác nhận mật khẩu
4.Người dùng nhấn đăng ký
5.Hệ thống kiểm tra hợp lệ:
    .Không để trống
    .Mật khẩu đủ điều kiện
6.Hệ thống kiểm tra trùng tài khoản
7.Nếu hợp lệ: hệ thống tạo tài khoản
8.Hệ thống thông báo Đăng ký thành công

# Luồng thay thế
1.Thiếu thông tin: nếu thiếu dữ liệu hệ thống yêu cầu nhập lại
2.Tài khoản đã tồn tại: nếu trùng tên đăng nhập hiển thị lỗi:"Tài khoản đã tồn tại"
3.Mật khẩu không hợp lệ: mật khẩu quá ngắn hoặc không đúng định dạng yêu cầu nhập lại

<h1>2. Use-case: Đăng nhập hệ thống</h1>
Tác nhân:
Người dùng
Admin
Mô tả:Cho phép người dùng hoặc admin truy cập vào hệ thống bằng tài khoản đã đăng ký.
Điều kiện: Đã có tài khoản hợp lệ

# Luồng chính
1.Người dùng/Admin chọn Đăng nhập
2.Hệ thống hiển thị form đăng nhập
3.Người dùng nhập:
    .Tên đăng nhập 
    .Mật khẩu
4.Người dùng nhấn Đăng nhập
5.Hệ thống kiểm tra thông tin
6.Nếu đúng:
    .Xác thực tài khoản
    .Xác định quyền (User/Admin)
7.Hệ thống chuyển vào trang chính

# Luồng thay thế
1.Nhập sai thông tin: nếu sai tài khoản hoặc mật khẩu hiển thị lỗi "Sai thông tin đăng nhập"
2.Tài khoản bị khóa: nếu tài khoản bị khóa hiển thị "Tài khoản đã bị khóa