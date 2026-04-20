# Phân Tích Yêu Cầu Phi Chức Năng — Decision Maker Platform

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