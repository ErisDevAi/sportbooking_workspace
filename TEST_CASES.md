# TEST CASES - DECISION MAKER PLATFORM

## 1. Authentication (Xac thuc)

### TC-AUTH-01: Dang ky thanh cong

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nguoi dung dang ky tai khoan moi thanh cong |
| **Tien dieu kien** | Chua co tai khoan, truy cap /register |
| **Buoc thuc hien** | 1. Truy cap trang /register |
|  | 2. Nhap ho ten: "Nguyen Van A" |
|  | 3. Nhap email: "test@example.com" |
|  | 4. Nhap mat khau: "123456" |
|  | 5. Nhap xac nhan mat khau: "123456" |
|  | 6. Nhan "Dang ky mien phi" |
| **Ket qua mong doi** | - Hien thi thong bao "Dang ky thanh cong!" |
|  | - Chuyen huong den trang /wheels |
|  | - Token duoc luu vao localStorage |
|  | - Thong tin user hien thi tren Navbar |

### TC-AUTH-02: Dang ky that bai - Email da ton tai

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | He thong tu choi dang ky khi email da duoc su dung |
| **Tien dieu kien** | Email "test@example.com" da ton tai trong he thong |
| **Buoc thuc hien** | 1. Truy cap /register |
|  | 2. Nhap thong tin voi email "test@example.com" |
|  | 3. Nhan "Dang ky mien phi" |
| **Ket qua mong doi** | - Hien thi loi "Email da duoc su dung" |
|  | - Khong chuyen trang |

### TC-AUTH-03: Dang ky that bai - Mat khau khong khop

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Validation tu choi khi mat khau xac nhan khong khop |
| **Buoc thuc hien** | 1. Nhap mat khau: "123456" |
|  | 2. Nhap xac nhan: "654321" |
|  | 3. Nhan "Dang ky mien phi" |
| **Ket qua mong doi** | - Hien thi loi "Mat khau khong khop" duoi truong xac nhan |

### TC-AUTH-04: Dang ky that bai - Thieu truong bat buoc

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Validation tu choi khi de trong truong bat buoc |
| **Buoc thuc hien** | 1. De trong tat ca cac truong |
|  | 2. Nhan "Dang ky mien phi" |
| **Ket qua mong doi** | - Hien thi loi validation cho tung truong |
|  | - "Vui long nhap ho ten", "Vui long nhap email", "Vui long nhap mat khau" |

### TC-AUTH-05: Dang nhap thanh cong

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nguoi dung dang nhap voi tai khoan hop le |
| **Tien dieu kien** | Tai khoan da ton tai |
| **Buoc thuc hien** | 1. Truy cap /login |
|  | 2. Nhap email va mat khau dung |
|  | 3. Nhan "Dang nhap" |
| **Ket qua mong doi** | - Thong bao "Dang nhap thanh cong" |
|  | - Chuyen huong den /wheels |
|  | - Avatar user hien thi tren Navbar |

### TC-AUTH-06: Dang nhap that bai - Sai mat khau

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | He thong tu choi khi sai mat khau |
| **Buoc thuc hien** | 1. Nhap email dung, mat khau sai |
|  | 2. Nhan "Dang nhap" |
| **Ket qua mong doi** | - Thong bao "Sai email hoac mat khau" |
|  | - Khong chuyen trang |

### TC-AUTH-07: Dang xuat

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nguoi dung dang xuat khoi he thong |
| **Tien dieu kien** | Da dang nhap |
| **Buoc thuc hien** | 1. Nhan avatar tren Navbar |
|  | 2. Chon "Dang xuat" |
| **Ket qua mong doi** | - Token bi xoa |
|  | - Chuyen huong ve trang chu |
|  | - Hien thi nut "Dang nhap" / "Dang ky" |

### TC-AUTH-08: Redirect khi chua dang nhap

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | He thong redirect khi truy cap trang bao ve |
| **Tien dieu kien** | Chua dang nhap |
| **Buoc thuc hien** | 1. Truy cap truc tiep /wheels |
| **Ket qua mong doi** | - Chuyen huong den /login?redirect=/wheels |
|  | - Sau khi dang nhap, quay lai /wheels |

---

## 2. Category Management (Quan ly danh muc)

### TC-CAT-01: Xem danh sach danh muc

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Hien thi danh sach tat ca danh muc |
| **Tien dieu kien** | Da dang nhap, co it nhat 1 danh muc |
| **Buoc thuc hien** | 1. Truy cap /categories |
| **Ket qua mong doi** | - Hien thi grid cards voi icon, ten, mau sac, so luong muc |
|  | - Hien thi trang thai "Cong khai" hoac "Rieng tu" |
|  | - Co nut "Tao danh muc" |

### TC-CAT-02: Tao danh muc moi

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Tao danh muc quyet dinh moi |
| **Buoc thuc hien** | 1. Nhan "Tao danh muc" |
|  | 2. Nhap ten: "An gi hom nay" |
|  | 3. Chon mau sac |
|  | 4. Nhap mo ta |
|  | 5. Nhan "Tao moi" |
| **Ket qua mong doi** | - Modal dong lai |
|  | - Danh muc moi xuat hien trong danh sach |
|  | - Thong bao "Tao danh muc thanh cong" |

### TC-CAT-03: Sua danh muc

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Chinh sua thong tin danh muc |
| **Buoc thuc hien** | 1. Hover vao card danh muc |
|  | 2. Nhan nut "Sua" |
|  | 3. Thay doi ten hoac mau sac |
|  | 4. Nhan "Cap nhat" |
| **Ket qua mong doi** | - Thong tin danh muc duoc cap nhat |
|  | - Thong bao "Cap nhat danh muc thanh cong" |

### TC-CAT-04: Xoa danh muc

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Xoa danh muc khoi he thong |
| **Buoc thuc hien** | 1. Hover vao card danh muc |
|  | 2. Nhan nut "Xoa" |
|  | 3. Xac nhan xoa trong dialog |
| **Ket qua mong doi** | - Danh muc bi xoa khoi danh sach |
|  | - Thong bao "Xoa thanh cong" |

### TC-CAT-05: Xem chi tiet danh muc

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Xem chi tiet va danh sach lua chon cua danh muc |
| **Buoc thuc hien** | 1. Nhan vao card danh muc |
| **Ket qua mong doi** | - Chuyen den trang /categories/[id] |
|  | - Hien thi ten, mau sac, mo ta |
|  | - Hien thi danh sach lua chon voi trong so |
|  | - Co nut "Them", "Quay ngay" |

### TC-CAT-06: Tao danh muc - Ten trong

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Validation khi khong nhap ten danh muc |
| **Buoc thuc hien** | 1. Nhan "Tao danh muc" |
|  | 2. De trong truong ten |
|  | 3. Nhan "Tao moi" |
| **Ket qua mong doi** | - Hien thi loi "Vui long nhap ten" |

---

## 3. Wheel Contents (Quan ly lua chon)

### TC-WC-01: Them lua chon vao danh muc

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Them lua chon moi vao danh muc |
| **Tien dieu kien** | Da chon danh muc tren trang /wheels |
| **Buoc thuc hien** | 1. Nhan nut "Them" |
|  | 2. Nhap ten: "Pho" |
|  | 3. Chon mau sac |
|  | 4. Dat trong so: 5 |
|  | 5. Nhan "Them" |
| **Ket qua mong doi** | - Lua chon moi xuat hien trong danh sach |
|  | - Vong quay cap nhat hien thi lua chon moi |
|  | - Thong bao "Them lua chon thanh cong" |

### TC-WC-02: Sua lua chon

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Sua thong tin lua chon |
| **Buoc thuc hien** | 1. Nhan icon "Sua" ben canh lua chon |
|  | 2. Thay doi ten hoac trong so |
|  | 3. Nhan "Cap nhat" |
| **Ket qua mong doi** | - Thong tin lua chon duoc cap nhat |
|  | - Vong quay cap nhat kich thuoc phan tuong ung |

### TC-WC-03: Xoa lua chon

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Xoa lua chon khoi danh muc |
| **Buoc thuc hien** | 1. Nhan icon "Xoa" ben canh lua chon |
| **Ket qua mong doi** | - Lua chon bi xoa khoi danh sach |
|  | - Vong quay cap nhat |
|  | - Thong bao "Da xoa" |

### TC-WC-04: Trong so anh huong xac suat

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Kiem tra trong so anh huong den kich thuoc phan tren vong quay |
| **Buoc thuc hien** | 1. Tao 2 lua chon: A (weight=1), B (weight=9) |
|  | 2. Quan sat vong quay |
| **Ket qua mong doi** | - Phan B chiem 90% dien tich vong quay |
|  | - Phan A chiem 10% dien tich vong quay |

---

## 4. Spin Wheel (Quay vong quay)

### TC-SPIN-01: Quay vong quay thanh cong

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Quay vong quay va nhan ket qua |
| **Tien dieu kien** | Da chon danh muc co it nhat 2 lua chon |
| **Buoc thuc hien** | 1. Nhan nut "QUAY NGAY!" |
| **Ket qua mong doi** | - Hieu ung quay 4 giay |
|  | - Modal hien thi ket qua voi ten va mau sac |
|  | - Hien thi nut "Chap nhan" va "Quay lai" |
|  | - Lich su quay duoc cap nhat |

### TC-SPIN-02: Khong the quay khi chua du lua chon

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nut quay bi vo hieu hoa khi chua du 2 lua chon |
| **Tien dieu kien** | Danh muc co 0 hoac 1 lua chon |
| **Buoc thuc hien** | 1. Quan sat nut "QUAY NGAY!" |
| **Ket qua mong doi** | - Nut bi disabled |
|  | - Hien thi thong bao "Can it nhat 2 lua chon de quay" |

### TC-SPIN-03: Chap nhan ket qua

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nguoi dung chap nhan ket qua quay |
| **Buoc thuc hien** | 1. Sau khi quay, nhan "Chap nhan quyet dinh nay" |
| **Ket qua mong doi** | - Modal ket qua dong lai |
|  | - Hien thi the "Da chap nhan" ben trai voi thong tin lua chon |
|  | - Hien thi nut "Xac nhan da hoan thanh" |
|  | - Thong bao "Da chap nhan: [ten lua chon]" |

### TC-SPIN-04: Re-spin (Quay lai)

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nguoi dung quay lai khi chua hai long |
| **Buoc thuc hien** | 1. Sau khi quay, nhan "Quay lai (con 2 luot)" |
| **Ket qua mong doi** | - Vong quay quay lai |
|  | - Hien thi ket qua moi |
|  | - So luot con lai giam 1 |
|  | - Hien thi "Da quay lai 1/2 lan" |

### TC-SPIN-05: Het luot re-spin

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | He thong tu choi re-spin khi da het luot |
| **Tien dieu kien** | Da re-spin 2 lan |
| **Buoc thuc hien** | 1. Nhan "Quay lai" lan thu 3 |
| **Ket qua mong doi** | - Nut "Quay lai" bi disabled |
|  | - Hien thi "Da het luot quay lai" |

### TC-SPIN-06: Khong the quay khi dang quay

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Khong the nhan quay trong khi animation dang chay |
| **Buoc thuc hien** | 1. Nhan "QUAY NGAY!" |
|  | 2. Ngay lap tuc nhan lai |
| **Ket qua mong doi** | - Nut hien thi "Dang quay..." va bi disabled |
|  | - Chi co 1 luot quay duoc thuc hien |

---

## 5. Check-in & Verification (Xac nhan hoan thanh)

### TC-CI-01: Check-in voi danh gia va ghi chu

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Xac nhan hoan thanh voi danh gia day du |
| **Tien dieu kien** | Da chap nhan 1 ket qua |
| **Buoc thuc hien** | 1. Nhan "Xac nhan da hoan thanh" |
|  | 2. Chon 4/5 sao |
|  | 3. Nhap ghi chu: "Pho hom nay ngon lam!" |
|  | 4. Nhan "Xac nhan hoan thanh & Cap nhat Streak" |
| **Ket qua mong doi** | - Modal dong lai |
|  | - The "Da chap nhan" bien mat |
|  | - Thong bao "Xac nhan hoan thanh! Streak da duoc cap nhat." |
|  | - Streak cards duoc cap nhat |
|  | - Lich su quay cap nhat trang thai "Da xac nhan" |

### TC-CI-02: Check-in khong co danh gia

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Xac nhan hoan thanh ma khong danh gia |
| **Buoc thuc hien** | 1. Nhan "Xac nhan da hoan thanh" |
|  | 2. Khong chon sao, khong nhap ghi chu |
|  | 3. Nhan "Xac nhan hoan thanh" |
| **Ket qua mong doi** | - Check-in thanh cong |
|  | - Streak van duoc cap nhat |

### TC-CI-03: Huy check-in

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nguoi dung huy bo check-in |
| **Buoc thuc hien** | 1. Nhan "Xac nhan da hoan thanh" |
|  | 2. Nhan "De sau" |
| **Ket qua mong doi** | - Modal dong lai |
|  | - The "Da chap nhan" van hien thi |
|  | - Streak khong thay doi |

---

## 6. History & Review (Lich su & Danh gia)

### TC-HIS-01: Xem lich su quay

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Hien thi lich su quay voi bo loc |
| **Buoc thuc hien** | 1. Cuon xuong phan "Lich su quay" tren trang /wheels |
| **Ket qua mong doi** | - Hien thi danh sach lich su voi ten lua chon, danh muc, streak, thoi gian |
|  | - Hien thi badge trang thai: "Da danh gia" / "Cho danh gia" / "Da xac nhan" |
|  | - Bo loc: "Tat ca", "Cho danh gia", "Da danh gia" |

### TC-HIS-02: Loc lich su theo trang thai

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Loc lich su theo trang thai danh gia |
| **Buoc thuc hien** | 1. Nhan tab "Cho danh gia" |
| **Ket qua mong doi** | - Chi hien thi cac luot quay chua duoc danh gia |
|  | - So luong hien thi tren badge cua tab |

### TC-HIS-03: Danh gia lich su

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Danh gia mot luot quay trong lich su |
| **Buoc thuc hien** | 1. Nhan nut "Danh gia" tren 1 luot quay |
|  | 2. Chon so sao |
|  | 3. Nhap ghi chu |
|  | 4. Nhan "Luu danh gia" |
| **Ket qua mong doi** | - Thong bao "Da luu danh gia!" |
|  | - Trang thai chuyen sang "Da danh gia" |
|  | - Nut chuyen thanh "Sua" (mau xanh la) |

### TC-HIS-04: Sua danh gia

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Sua danh gia da luu |
| **Buoc thuc hien** | 1. Nhan "Sua" tren luot quay da danh gia |
|  | 2. Thay doi so sao hoac ghi chu |
|  | 3. Nhan "Luu danh gia" |
| **Ket qua mong doi** | - Danh gia duoc cap nhat |

---

## 7. Streak & Stats (Thong ke)

### TC-STREAK-01: Hien thi streak cards

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Hien thi thong tin streak tren trang vong quay |
| **Tien dieu kien** | Da co it nhat 1 luot check-in |
| **Buoc thuc hien** | 1. Chon danh muc da co streak |
| **Ket qua mong doi** | - Hien thi 3 cards: Streak hien tai, Ky luc, Tong quay |
|  | - Streak hien tai co icon lua chay animation |

### TC-STREAK-02: Xem trang thong ke

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Xem thong ke chi tiet tren trang /stats |
| **Buoc thuc hien** | 1. Truy cap /stats |
| **Ket qua mong doi** | - Hien thi 5 stat cards: Streak, Ky luc, Tong quay, Ngay hoat dong, Ngay tham gia |
|  | - Hien thi lich hoat dong dang calendar heatmap |
|  | - Hien thi streak theo tung danh muc |

### TC-STREAK-03: Lich hoat dong - Click ngay

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Xem chi tiet hoat dong 1 ngay cu the |
| **Buoc thuc hien** | 1. Nhan vao 1 ngay co hoat dong tren lich |
| **Ket qua mong doi** | - Modal hien thi chi tiet: so luot quay, lua chon, thoi gian, rating |
|  | - Hien thi trang thai xac nhan cua tung luot |

### TC-STREAK-04: Loc thong ke theo danh muc

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Loc thong ke theo 1 danh muc cu the |
| **Buoc thuc hien** | 1. Chon danh muc tu dropdown tren trang /stats |
| **Ket qua mong doi** | - Tat ca thong ke chi hien thi cho danh muc da chon |
|  | - Lich hoat dong cap nhat tuong ung |

### TC-STREAK-05: Bang xep hang

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Hien thi bang xep hang nguoi dung |
| **Tien dieu kien** | Co nhieu user trong he thong |
| **Buoc thuc hien** | 1. Cuon xuong phan "Bang xep hang" tren /stats |
| **Ket qua mong doi** | - Hien thi top 10 nguoi dung theo streak |
|  | - Highlight nguoi dung hien tai (mau do) |
|  | - Hien thi huy hieu vang/bac/dong cho top 3 |

---

## 8. Profile (Ho so)

### TC-PROF-01: Xem ho so ca nhan

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Xem thong tin ho so va thong ke ca nhan |
| **Buoc thuc hien** | 1. Nhan avatar -> "Ho so & Streak" |
| **Ket qua mong doi** | - Hien thi avatar, ten, email |
|  | - Hien thi tong quan streak: hien tai, ky luc, tong quay |
|  | - Hien thi streak theo tung danh muc |
|  | - Hien thi lich su quay gan day |

---

## 9. Tour Guide (Huong dan)

### TC-TOUR-01: Tour tu dong cho nguoi dung moi

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Tour tu dong hien thi khi lan dau truy cap |
| **Tien dieu kien** | Chua tung xem tour (khong co key trong localStorage) |
| **Buoc thuc hien** | 1. Truy cap /wheels lan dau |
| **Ket qua mong doi** | - Tour tu dong bat dau sau 1.2 giay |
|  | - Hien thi overlay voi spotlight |
|  | - Hien thi buoc 1: "Chao mung den Decision Maker!" |

### TC-TOUR-02: Chuyen buoc tour

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nguoi dung chuyen giua cac buoc tour |
| **Buoc thuc hien** | 1. Bat dau tour |
|  | 2. Nhan "Tiep" de chuyen buoc |
|  | 3. Nhan "Quay lai" de xem buoc truoc |
| **Ket qua mong doi** | - Spotlight di chuyen den phan tu tuong ung |
|  | - Noi dung cap nhat theo buoc |
|  | - Hien thi progress (buoc hien tai / tong buoc) |

### TC-TOUR-03: Bo qua tour

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nguoi dung bo qua tour |
| **Buoc thuc hien** | 1. Trong tour, nhan "Bo qua" |
| **Ket qua mong doi** | - Tour dong lai |
|  | - Trang thai "da xem" duoc luu vao localStorage |
|  | - Tour khong tu dong hien thi lan sau |

### TC-TOUR-04: Kich hoat lai tour

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Nguoi dung kich hoat lai tour tu nut "?" |
| **Tien dieu kien** | Da xem tour truoc do |
| **Buoc thuc hien** | 1. Nhan nut "?" (goc phai duoi man hinh) |
| **Ket qua mong doi** | - Tour bat dau lai tu buoc 1 |
|  | - Tat ca cac buoc hien thi binh thuong |

### TC-TOUR-05: Tour trang chu

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Tour trang chu hien thi dung cac buoc |
| **Buoc thuc hien** | 1. Truy cap / (trang chu) lan dau |
| **Ket qua mong doi** | - Tour 3 buoc: Chao mung -> Demo wheel -> Quick cards |

---

## 10. UI/UX Consistency

### TC-UI-01: Cursor pointer tren tat ca button

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Tat ca nut bam deu co cursor pointer |
| **Buoc thuc hien** | 1. Di chuyen chuot qua tung nut tren moi trang |
| **Ket qua mong doi** | - Tat ca button, link, dropdown, switch deu hien thi con tro pointer |
|  | - Nut disabled hien thi con tro not-allowed |

### TC-UI-02: Thong nhat style button

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Tat ca button cung loai co cung style |
| **Buoc thuc hien** | 1. Kiem tra nut "Sua" tren trang /categories, /categories/[id], /wheels |
|  | 2. Kiem tra nut "Xoa" tren cac trang tuong tu |
|  | 3. Kiem tra nut primary tren moi trang |
| **Ket qua mong doi** | - Nut "Sua": nen xanh nhat, chu xanh duong, border-radius nhat quan |
|  | - Nut "Xoa": nen do nhat, chu do, border-radius nhat quan |
|  | - Nut primary: nen do #E53E3E, chu trang |

### TC-UI-03: Responsive design

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Giao dien hien thi dung tren nhieu kich thuoc man hinh |
| **Buoc thuc hien** | 1. Xem trang tren Desktop (1920px) |
|  | 2. Xem trang tren Tablet (768px) |
|  | 3. Xem trang tren Mobile (375px) |
| **Ket qua mong doi** | - Layout tu dong dieu chinh |
|  | - Khong bi tran hoac bi cut noi dung |
|  | - Menu mobile hoat dong khi thu nho man hinh |

### TC-UI-04: Animations muot ma

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Kiem tra cac hieu ung animation |
| **Buoc thuc hien** | 1. Tai trang - quan sat entrance animations |
|  | 2. Hover vao cards - quan sat hover lift |
|  | 3. Mo modal - quan sat entrance animation |
|  | 4. Quay vong quay - quan sat spin animation |
| **Ket qua mong doi** | - Tat ca animation chay muot, khong bi giat |
|  | - Toc do phu hop, khong qua nhanh hoac cham |

### TC-UI-05: Navbar sticky va blur on scroll

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Navbar dinh tren dau va co hieu ung blur khi cuon |
| **Buoc thuc hien** | 1. Cuon trang xuong |
| **Ket qua mong doi** | - Navbar van o tren cung |
|  | - Nen chuyen sang semi-transparent voi backdrop-blur |
|  | - Co shadow nhe xuat hien |

---

## 11. Navigation & Routing

### TC-NAV-01: Nav links hoat dong dung

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Tat ca link tren navbar chuyen trang dung |
| **Buoc thuc hien** | 1. Nhan "Danh muc" -> /categories |
|  | 2. Nhan "Vong quay" -> /wheels |
|  | 3. Nhan "Streak" -> /stats |
|  | 4. Nhan "Gioi thieu" -> /about |
| **Ket qua mong doi** | - Chuyen den dung trang |
|  | - Link hien tai duoc highlight (mau do, nen do nhat) |

### TC-NAV-02: Mobile menu

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Menu mobile mo/dong dung |
| **Tien dieu kien** | Man hinh < 768px |
| **Buoc thuc hien** | 1. Nhan icon hamburger |
|  | 2. Nhan link trong menu |
| **Ket qua mong doi** | - Menu mo ra voi animation |
|  | - Nhan link thi menu tu dong dong lai |
|  | - Nhan lai icon hamburger thi dong menu |

### TC-NAV-03: Footer links

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Tat ca link trong footer hoat dong |
| **Buoc thuc hien** | 1. Kiem tra tung link trong footer |
| **Ket qua mong doi** | - Moi link chuyen den trang tuong ung |
|  | - Link "Bat dau mien phi" chuyen den /register |

---

## 12. Demo Wheel (Trang chu)

### TC-DEMO-01: Demo wheel hoat dong khong can dang nhap

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Vong quay demo tren trang chu hoat dong voi du lieu mac dinh |
| **Tien dieu kien** | Chua dang nhap |
| **Buoc thuc hien** | 1. Truy cap trang chu |
|  | 2. Chon tab danh muc (An gi?, Lam gi?, Di dau?, Hoc gi?) |
|  | 3. Nhan QUAY |
| **Ket qua mong doi** | - Hien thi vong quay voi 6 lua chon fallback |
|  | - Quay va hien thi ket qua |
|  | - Cac tab danh muc chuyen duoc |

### TC-DEMO-02: Demo wheel tai du lieu thuc khi da dang nhap

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Vong quay demo hien thi du lieu thuc tu API |
| **Tien dieu kien** | Da dang nhap, co danh muc va lua chon |
| **Buoc thuc hien** | 1. Truy cap trang chu |
| **Ket qua mong doi** | - Hien thi danh muc tu API thay vi fallback |
|  | - Lua chon tuong ung voi danh muc |

---

## 13. Error Handling

### TC-ERR-01: Mat ket noi API

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Xu ly khi khong ket noi duoc API |
| **Buoc thuc hien** | 1. Tat server API |
|  | 2. Thuc hien thao tac (quay, tao danh muc...) |
| **Ket qua mong doi** | - Hien thi thong bao loi ro rang |
|  | - Khong crash trang |
|  | - Du lieu cuc bo van duoc giu |

### TC-ERR-02: Trang 404

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Truy cap URL khong ton tai |
| **Buoc thuc hien** | 1. Truy cap /abc-khong-ton-tai |
| **Ket qua mong doi** | - Hien thi trang 404 hoac redirect ve trang chu |

### TC-ERR-03: Danh muc khong ton tai

| Thuoc tinh | Mo ta |
| --- | --- |
| **Mo ta** | Truy cap chi tiet danh muc khong ton tai |
| **Buoc thuc hien** | 1. Truy cap /categories/invalid-id |
| **Ket qua mong doi** | - Hien thi "Khong tim thay danh muc" |
|  | - Co nut "Quay lai" |
