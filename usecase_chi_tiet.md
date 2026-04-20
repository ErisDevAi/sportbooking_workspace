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

<h1>UC13:Check-in</h3>

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



