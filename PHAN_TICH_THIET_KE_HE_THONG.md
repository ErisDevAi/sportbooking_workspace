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

##### 1. Mô tả

Chức năng cho phép người dùng tạo tài khoản mới để truy cập hệ thống.

##### 2. Actor

Người dùng (User)

##### 3. Tiền điều kiện (Pre-condition)

<ul>
    <li>Người dùng chưa đăng nhập</li>
    <li>Người dùng truy cập trang đăng ký</li>
</ul>

##### 4. Hậu điều kiện (Post-condition)

<ul>
    <li><span class="success">Thành công:</span> Tài khoản được lưu vào hệ thống</li>
    <li><span class="error">Thất bại:</span> Không có dữ liệu nào được lưu</li>
</ul>

##### 5. Luồng chính (Main Flow)

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
    <li>Lưu vào MongoDB</li>
    <li>Hiển thị thông báo <span class="success">Đăng ký thành công</span></li>
  </ol>

##### 6. Luồng thay thế (Alternative Flow)

<ul>
    <li class="error">A1: Thiếu dữ liệu → "Không được để trống"</li>
    <li class="error">A2: Email không hợp lệ → "Email không hợp lệ"</li>
    <li class="error">A3: Mật khẩu không khớp → "Mật khẩu không khớp"</li>
    <li class="error">A4: Tài khoản đã tồn tại → "Username hoặc Email đã tồn tại"</li>
</ul>

##### 7. Yêu cầu chức năng (Functional Requirements)

<ul>
    <li>FR-R1: Cung cấp form đăng ký</li>
    <li>FR-R2: Kiểm tra dữ liệu đầu vào (validate valuations)</li>
    <li>FR-R3: Kiểm tra trùng tài khoản</li>
    <li>FR-R4: Mã hóa mật khẩu</li>
    <li>FR-R5: Lưu dữ liệu vào MongoDB</li>
    <li>FR-R6: Trả thông báo kết quả</li>
</ul>

##### 8. Yêu cầu phi chức năng (Non-functional Requirements)

###### Bảo mật
  <ul>
    <li>Password phải được hash (bcrypt) bằng JWT</li>
    <li>Không lưu password dạng plain text</li>
    <li>Dữ liệu truyền qua HTTPS</li>
  </ul>

###### Hiệu năng
  <ul>
    <li>Thời gian xử lý &lt; 2 giây</li>
  </ul>

###### Khả năng mở rộng
  <ul>
    <li>Hỗ trợ nhiều user đăng ký cùng lúc</li>
  </ul>

###### Khả dụng (Usability)
  <ul>
    <li>Giao diện dễ hiểu, thông báo rõ ràng</li>
  </ul>

#### Đăng nhập (Login)

##### 1. Mô tả

Cho phép người dùng truy cập hệ thống bằng tài khoản đã đăng ký.

##### 2. Tác nhân (Actor)

Người dùng (User)

##### 3. Tiền điều kiện

- Người dùng đã có tài khoản trong hệ thống

##### 4. Hậu điều kiện

- **Thành công:** Người dùng nhận được token (JWT) / session và truy cập được hệ thống
- **Thất bại:** Không tạo session, người dùng không thể truy cập

##### 5. Luồng chính (Main Flow)

1. Người dùng chọn chức năng **Đăng nhập**
2. Hệ thống hiển thị form đăng nhập
3. Người dùng nhập:
   - Username hoặc Email
   - Password
4. Người dùng nhấn **Login**
5. Hệ thống kiểm tra dữ liệu không rỗng
6. Hệ thống tìm user trong MongoDB
7. Hệ thống so sánh password (hash)
8. Nếu đúng:
   - Tạo token (JWT) / session
   - Trả về client
   - Hiển thị thông báo **Đăng nhập thành công**

##### 6. Luồng thay thế (Alternative Flow)

- A1: Thiếu dữ liệu → "Vui lòng nhập đầy đủ thông tin"
- A2: Không tìm thấy user → "Tài khoản không tồn tại"
- A3: Sai mật khẩu → "Sai mật khẩu"
- A4: Tài khoản bị khóa → "Tài khoản bị khóa"

##### 7. Yêu cầu chức năng (Functional Requirements)

- FR-L1: Hiển thị form đăng nhập
- FR-L2: Kiểm tra dữ liệu đầu vào
- FR-L3: Xác thực tài khoản (so sánh username/email và password)
- FR-L4: Tạo token (JWT) / session
- FR-L5: Trả kết quả cho client

##### 8. Yêu cầu phi chức năng (Non-functional Requirements)

###### Bảo mật
- Password được mã hóa bằng bcrypt
- Token JWT có thời hạn
- Giới hạn số lần đăng nhập sai

###### Hiệu năng
- Thời gian xử lý < 2 giây

###### Độ tin cậy
- Hệ thống ổn định khi nhiều user đăng nhập đồng thời

###### Khả dụng (Usability)
- Thông báo lỗi rõ ràng, dễ hiểu

#### Quản lý các thư mục quyết định (Categories)

##### 1. Mô tả

Cho phép người dùng tạo và quản lý các thư mục để phân loại các quyết định theo từng chủ đề như ăn uống, giải trí, học tập...

##### 2. Tác nhân (Actor)

Người dùng (User)

##### 3. Tiền điều kiện

- Người dùng đã đăng nhập hệ thống

##### 4. Hậu điều kiện

- **Thành công:** Thư mục được tạo mới / cập nhật / xóa thành công
- **Thất bại:** Không có thay đổi dữ liệu trong hệ thống

##### 5. Luồng chính (Main Flow)

**5.1. Tạo thư mục**

1. Người dùng chọn **Tạo thư mục**
2. Hệ thống hiển thị form nhập
3. Người dùng nhập tên thư mục
4. Người dùng nhấn **Lưu**
5. Hệ thống kiểm tra dữ liệu hợp lệ
6. Lưu vào MongoDB
7. Hiển thị danh sách thư mục cập nhật

**5.2. Sửa thư mục**

1. Người dùng chọn **Sửa** trên thư mục cần chỉnh sửa
2. Nhập tên mới
3. Hệ thống kiểm tra hợp lệ
4. Cập nhật MongoDB

**5.3. Xóa thư mục**

1. Người dùng chọn **Xóa** trên thư mục cần xóa
2. Hệ thống hiển thị xác nhận
3. Người dùng xác nhận → Xóa khỏi MongoDB

##### 6. Luồng thay thế (Alternative Flow)

- A1: Tên rỗng → "Không được để trống"
- A2: Trùng tên thư mục → "Thư mục đã tồn tại"
- A3: Lỗi hệ thống → "Vui lòng thử lại"
- A4: Xóa thư mục có chứa quyết định → "Bạn có chắc chắn muốn xóa?"

##### 7. Yêu cầu chức năng (Functional Requirements)

- FR-F1: Tạo thư mục mới
- FR-F2: Hiển thị danh sách thư mục
- FR-F3: Chỉnh sửa thư mục
- FR-F4: Xóa thư mục
- FR-F5: Validate dữ liệu đầu vào

##### 8. Yêu cầu phi chức năng (Non-functional Requirements)

###### Bảo mật
- Chỉ user đã đăng nhập mới được thao tác
- User chỉ quản lý thư mục của chính mình

###### Hiệu năng
- Thời gian xử lý < 1 giây

###### Khả năng mở rộng
- Hỗ trợ nhiều user thao tác đồng thời

###### Khả dụng (Usability)
- Giao diện đơn giản, dễ sử dụng

#### Quản lý các quyết định (Choices)

##### 1. Mô tả

Cho phép người dùng thêm, chỉnh sửa và quản lý các lựa chọn (quyết định) trong từng thư mục.

##### 2. Tác nhân (Actor)

Người dùng (User)

##### 3. Tiền điều kiện

- Người dùng đã đăng nhập
- Đã có ít nhất một thư mục quyết định

##### 4. Hậu điều kiện

- **Thành công:** Quyết định được thêm mới / cập nhật / xóa thành công
- **Thất bại:** Không có thay đổi dữ liệu trong hệ thống

##### 5. Luồng chính (Main Flow)

**5.1. Thêm quyết định**

1. Người dùng chọn một thư mục
2. Nhấn **Thêm quyết định**
3. Nhập nội dung quyết định
4. Nhấn **Lưu**
5. Hệ thống kiểm tra dữ liệu hợp lệ
6. Lưu vào MongoDB
7. Hiển thị danh sách quyết định cập nhật

**5.2. Sửa quyết định**

1. Người dùng chọn **Sửa** trên quyết định cần chỉnh sửa
2. Nhập nội dung mới
3. Hệ thống kiểm tra hợp lệ
4. Cập nhật MongoDB

**5.3. Xóa quyết định**

1. Người dùng chọn **Xóa** trên quyết định cần xóa
2. Hệ thống hiển thị xác nhận
3. Người dùng xác nhận → Xóa khỏi MongoDB

##### 6. Luồng thay thế (Alternative Flow)

- A1: Nội dung rỗng → "Không được để trống"
- A2: Trùng nội dung trong cùng thư mục → "Quyết định đã tồn tại"
- A3: Lỗi hệ thống → "Vui lòng thử lại"

##### 7. Yêu cầu chức năng (Functional Requirements)

- FR-D1: Thêm quyết định vào thư mục
- FR-D2: Hiển thị danh sách quyết định theo thư mục
- FR-D3: Chỉnh sửa nội dung quyết định
- FR-D4: Xóa quyết định
- FR-D5: Validate dữ liệu đầu vào

##### 8. Yêu cầu phi chức năng (Non-functional Requirements)

###### Bảo mật
- Chỉ user đã đăng nhập mới được thao tác
- User chỉ quản lý quyết định của chính mình

###### Hiệu năng
- Thời gian xử lý < 1 giây

###### Khả năng mở rộng
- Hỗ trợ nhiều user thao tác đồng thời

###### Khả dụng (Usability)
- Giao diện dễ hiểu, thao tác trực quan

#### Đưa ra quyết định (Make Decision)

##### 1. Mô tả

Hệ thống hỗ trợ người dùng lựa chọn nhanh bằng cách chọn ngẫu nhiên một quyết định từ danh sách các lựa chọn trong thư mục.

##### 2. Tác nhân (Actor)

Người dùng (User)

##### 3. Tiền điều kiện

- Người dùng đã đăng nhập
- Đã có ít nhất một thư mục chứa các quyết định

##### 4. Hậu điều kiện

- **Thành công:** Hệ thống hiển thị kết quả quyết định được chọn ngẫu nhiên
- **Thất bại:** Không có kết quả (thư mục rỗng hoặc lỗi hệ thống)

##### 5. Luồng chính (Main Flow)

1. Người dùng chọn một thư mục quyết định
2. Nhấn **Quay** (Spin)
3. Hệ thống thực hiện hiệu ứng quay (spin wheel)
4. Hệ thống chọn ngẫu nhiên một quyết định từ danh sách
5. Hiển thị kết quả quyết định được chọn
6. Người dùng có thể:
   - **Chấp nhận** quyết định
   - **Bỏ qua** và quay lại

##### 6. Luồng thay thế (Alternative Flow)

- A1: Thư mục rỗng (không có quyết định) → "Vui lòng thêm quyết định trước"
- A2: Lỗi hệ thống → "Vui lòng thử lại"

##### 7. Yêu cầu chức năng (Functional Requirements)

- FR-M1: Chọn ngẫu nhiên quyết định từ danh sách
- FR-M2: Hiển thị hiệu ứng quay (spin wheel) tạo trải nghiệm thú vị
- FR-M3: Hiển thị kết quả quyết định
- FR-M4: Cho phép chấp nhận hoặc bỏ qua kết quả
- FR-M5: Lưu lịch sử quyết định

##### 8. Yêu cầu phi chức năng (Non-functional Requirements)

###### Bảo mật
- Chỉ user đã đăng nhập mới được sử dụng chức năng

###### Hiệu năng
- Hiệu ứng quay mượt mà, thời gian xử lý < 1 giây

###### Khả dụng (Usability)
- Hiệu ứng quay trực quan, tạo cảm giác thú vị cho người dùng
- Kết quả hiển thị rõ ràng, dễ đọc

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
