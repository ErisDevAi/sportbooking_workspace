# PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG - DECISION MAKER

## Website: Decision Maker - "Hỏi và Làm" (Ask & Do)

### 1. Giới thiệu

Decision Maker là một web application giúp người dùng ra quyết định hàng ngày thông qua cơ chế random / spin wheel.

Ứng dụng tập trung vào việc:

- Giảm thời gian suy nghĩ
- Tăng hành động thực tế
- Tạo thói quen thông qua streak và check-in

### Các giá trị cốt lõi chính của app decision maker ( phần mềm hỗ trợ đưa ra quyết định )

- Giải quyết tình trạng không thể ra quyết định vì quá nhiều lựa chọn => Hỗ trợ đưa ra quyết định nhanh
- Gamify quá trình ra quyết định để tạo thói quen tích cực => Biến quyết định thành trò chơi
- Cá nhân hoá thông minh. App hiểu user => Gợi ý tốt hơn theo thời gian
- Đơn giản hóa mọi thứ, nhẹ suy nghĩ hơn

### Các nhóm người dùng chính (Personas chính)

- Người dùng cá nhân: Khó quyết định ăn gì, mặc gì, đi đâu hàng ngày 
- Nhóm bạn: Cùng quay và thực hiện thử thách
- Couples: Quyết định hẹn hò đi đâu, ăn gì
- Nhà quản lý: sử dụng kết quả để ra quyết định
- Nhà phân tích: xử lý và phân tích dữ liệu
- Nhân viên: nhập và cập nhật dữ liệu
- Quản trị hệ thống: quản lý và vận hành hệ thống
- Hệ thống ngoài: cung cấp và trao đổi dữ liệu

### User Flow

#### 1. User flow: Vào web → chọn nhanh gợi ý

Mục tiêu: Người dùng muốn có ngay ý tưởng

- Truy cập website -> Trang chủ hiển thị: “Hôm nay bạn muốn làm gì?” 2 nút lớn: Ăn gì 🍔 / Làm gì 🎯
User chọn 1 trong 2
Hệ thống random / gợi ý danh sách
Hiển thị kết quả:
Tên món ăn / hoạt động
Mô tả ngắn
Nút: “Thử lại” / “Xem chi tiết”

#### 1. User flow: Lọc theo sở thích (Filter)

Mục tiêu: Người dùng muốn gợi ý phù hợp hơn

Vào trang chủ
Chọn “Ăn gì” hoặc “Làm gì”
Chọn bộ lọc:
Ngân sách (rẻ / trung / xịn)
Thời gian (nhanh / rảnh)
Tâm trạng (buồn / vui / chill)
Đi một mình / bạn bè / người yêu
Nhấn “Tìm kiếm”
Hệ thống trả về danh sách phù hợp
User chọn 1 gợi ý → xem chi tiết

#### 3. User flow: Xem chi tiết & quyết định

Mục tiêu: Giúp user quyết định chọn hay không

User click vào 1 gợi ý
Trang chi tiết hiển thị:
Mô tả
Hình ảnh
Địa điểm (nếu có)
Giá tiền
Nút hành động:
“Chọn cái này”
“Xem gợi ý khác”

#### 4.User flow: Lưu yêu thích (Favorite)

Mục tiêu: Lưu lại để dùng sau

User đăng nhập (hoặc dùng guest)
Khi xem gợi ý → bấm “❤️ Lưu”
Hệ thống lưu vào danh sách cá nhân
User vào “Yêu thích” để xem lại

### Tech Stack

### Frontend

- Next.js (App Router)
- Ant Design
- TailwindCSS

### Backend

- Node.js
- Express
- MongoDB

### Phân tích chức năng

#### Đăng ký (Register)

#### Đăng nhập (Login)

#### Quản lý các thư mục quyết định (Categories)

#### Quản lý các quyết định (choices)

#### Đưa ra quyết định (Make Decision)

### Phân tích phi chức năng
<table>
  <tr>
    <th>Mã</th>
    <th>Yêu cầu phi chức năng</th>
    <th>Mức ưu tiên</th>
    <th>Mô tả chi tiết yêu cầu</th>
    <th>Áp dụng</th>
    <th>Ghi chú</th>
  </tr>
  <tr>
    <td>NFR1</td>
    <td>Hiệu năng (Performance) </td>
    <td>Cao</td>
    <td>Hệ thống phải đảm bảo thời gian phản hồi nhanh, mang lại trải nghiệm mượt mà cho người dùng khi thực hiện các thao tác như quay vòng quay quyết định, tải trang, đăng nhập và xem kết quả.</td>
    <td>Toàn hệ thống</td>
    <td>Ảnh hưởng trực tiếp đến trải nghiệm người dùng</td>
  </tr>
  <tr>
    <td>NFR2</td>
    <td>Khả năng chịu tải</td>
    <td>Trung bình</td>
    <td>Hệ thống phải hỗ trợ tối thiểu 100 người dùng truy cập đồng thời trong môi trường triển khai thử nghiệm mà không suy giảm đáng kể hiệu suất. Đặc biệt trong các khung giờ cao điểm (giờ ăn trưa, giờ tan làm, cuối tuần) lượng người dùng sử dụng hệ thống sẽ rất nhiều</td>
    <td>Toàn hệ thống</td>
    <td>Tăng dần theo lượng người dùng thực tế</td>
  </tr>
  <tr>
    <td>NFR3</td>
    <td>Bảo mật & Xác thực</td>
    <td>Cao</td>
    <td>Người dùng phải đăng nhập để lưu trữ dữ liệu quyết định trên server. Mật khẩu phải được mã hóa khi lưu trữ; dữ liệu truyền tải phải sử dụng giao thức bảo mật (HTTPS). </td>
    <td>Toàn hệ thống</td>
    <td>Bảo vệ dữ liệu cá nhân người dùng</td>
  </tr>
  <tr>
    <td>NFR4</td>
    <td>Toàn vẹn dữ liệu</td>
    <td>Cao</td>
    <td>Dữ liệu người dùng, các nội dung quyết định phải được lưu trữ chính xác, không bị mất mát hoặc trùng lặp khi xảy ra lỗi hệ thống.</td>
    <td>Backend, CSDL </td>
    <td>Đảm bảo dữ liệu không mất mát hoặc sai lệch</td>
  </tr>
  <tr>
    <td>NFR5</td>
    <td>Khả năng mở rộng</td>
    <td>Trung bình</td>
    <td>Hệ thống được thiết kế theo kiến trúc phân tầng, hỗ trợ mở rộng số lượng người dùng và tăng lưu lượng truy cập khi cần thiết. </td>
    <td>Kiến trúc hệ thống</td>
    <td></td>
  </tr>
  <tr>
    <td>NFR6</td>
    <td>Tính sẵn sàng</td>
    <td>Trung bình</td>
    <td>Hệ thống phải đảm bảo thời gian hoạt động ổn định trong điều kiện triển khai bình thường.</td>
    <td>Toàn hệ thống </td>
    <td>Tăng lên Cao khi có nhiều người dùng</td>
  </tr>
  <tr>
    <td>NFR7</td>
    <td>Khả năng sử dụng (Usability) </td>
    <td>Cao</td>
    <td>Giao diện hệ thống phải trực quan, dễ sử dụng, phù hợp với mọi đối tượng người dùng (cá nhân, nhóm bạn, cặp đôi) mà không cần hướng dẫn phức tạp. Các chức năng chính như triển khai quyết định phải thực hiện trong tối đa 3 bước thao tác -> Thêm mới quyết định -> Tạo quyết định -> Hệ thống đưa ra quyết định sau lần quay</td>
    <td>Frontend</td>
    <td></td>
  </tr>
  <tr>
    <td>NFR8</td>
    <td>Sao lưu & Phục hồi</td>
    <td>Trung bình</td>
    <td>Hệ thống phải có cơ chế sao lưu dữ liệu định kỳ và khả năng phục hồi nhanh chóng trong trường hợp mất dữ liệu hoặc sự cố nghiêm trọng.</td>
    <td>CSDL</td>
    <td>Quan trọng khi có dữ liệu người dùng thực.</td>
  </tr>
  <tr>
    <td>NFR9</td>
    <td>Khả năng bảo trì</td>
    <td>Trung bình</td>
    <td>Mã nguồn và hệ thống phải được tổ chức rõ ràng, dễ hiểu, dễ sửa đổi và nâng cấp bởi bất kỳ thành viên nào trong nhóm phát triển.</td>
    <td>Toàn hệ thống</td>
    <td>Giúp phát triển bền vững dài hạn</td>
  </tr>
  <tr>
    <td>NFR10</td>
    <td>Tương thích trình duyệt</td>
    <td>Cao</td>
    <td>Ứng dụng web phải hoạt động ổn định trên các trình duyệt phổ biến như Chrome, Edge Safari, và Firefox phiên bản hiện hành. Đáp ứng responsive cho các thiết bị Desktop, Tablet, Điện thoại </td>
    <td>Fronend</td>
    <td></td>
  </tr>
</table>