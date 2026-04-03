# Cơ sở dữ liệu - dApp Quản Lý Thuê Nhà

## Yêu cầu

- PostgreSQL 14 trở lên
- Encoding: `UTF8` (hỗ trợ tiếng Việt đầy đủ)

## Hướng dẫn sử dụng

### 1. Thiết lập lần đầu (tự động)

Chạy script `setup.ps1` — tự tạo DB, schema và nạp dữ liệu mẫu:

```powershell
.\database\setup.ps1
```

### 2. Chạy thủ công từng bước

```powershell
$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Bước 1: Tạo database
& $psql -U postgres -c "CREATE DATABASE quanlythuenha ENCODING 'UTF8';"

# Bước 2: Tạo bảng
& $psql -U postgres -d quanlythuenha -f database/schema.sql

# Bước 3: Nạp dữ liệu mẫu
& $psql -U postgres -d quanlythuenha -f database/seed.sql
```

### 3. Xóa và tạo lại từ đầu

```powershell
$psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
& $psql -U postgres -c "DROP DATABASE IF EXISTS quanlythuenha;"
.\database\setup.ps1
```

---

## Sơ đồ quan hệ (ERD)

```
nguoi_dung ────────┬──────── bat_dong_san ──── hinh_anh (bat_dong_san)
                   │                │
                   │                ├──── phong ──── hinh_anh (phong)
                   │                │       │
                   │                │       ├──── hop_dong
                   │                │       │         │
                   │                │       │         ├──── hoa_don ──── thanh_toan
                   │                │       │         │
                   │                │       │         └──── su_dung_dich_vu
                   │                │       │
                   │                │       └──── yeu_cau_sua_chua
                   │                │
                   │                └──── dich_vu
                   │
                   └──── thong_bao
```

---

## Mô tả các bảng

### 1. `nguoi_dung` - Người dùng
Người dùng hệ thống với 3 vai trò: `admin`, `chu_nha`, `nguoi_thue`.
Mỗi user có thể liên kết với một địa chỉ ví Ethereum (`dia_chi_vi`).

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `ma_nguoi_dung` | SERIAL PK | Mã người dùng |
| `dia_chi_vi` | VARCHAR(42) | Địa chỉ ví Ethereum |
| `ho_ten` | VARCHAR(100) | Họ tên |
| `email` | VARCHAR(100) | Email (duy nhất) |
| `so_dien_thoai` | VARCHAR(15) | Số điện thoại |
| `mat_khau_hash` | VARCHAR(255) | Mật khẩu mã hóa (bcrypt) |
| `so_cccd` | VARCHAR(20) | Số CCCD (duy nhất) |
| `anh_cccd_mat_truoc` | TEXT | Ảnh CCCD mặt trước |
| `anh_cccd_mat_sau` | TEXT | Ảnh CCCD mặt sau |
| `anh_dai_dien` | TEXT | Ảnh đại diện |
| `vai_tro` | VARCHAR(20) | `admin` / `chu_nha` / `nguoi_thue` |
| `da_xac_thuc` | BOOLEAN | Đã xác thực danh tính |
| `dang_hoat_dong` | BOOLEAN | Tài khoản đang hoạt động |

### 2. `bat_dong_san` - Bất động sản
Tòa nhà / nhà trọ / chung cư thuộc sở hữu của chủ nhà.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `ma_bat_dong_san` | SERIAL PK | Mã bất động sản |
| `ma_chu_so_huu` | INT FK | Chủ sở hữu |
| `ten` | VARCHAR(200) | Tên |
| `dia_chi` | VARCHAR(500) | Địa chỉ |
| `thanh_pho`, `quan_huyen`, `phuong_xa` | VARCHAR | Thành phố, quận, phường |
| `loai_bat_dong_san` | VARCHAR(30) | `chung_cu` / `nha_o` / `nha_tro` |
| `tong_so_phong` | INT | Tổng số phòng |
| `vi_do`, `kinh_do` | DECIMAL | Tọa độ GPS |

### 3. `hinh_anh` - Ảnh
Ảnh cho cả bất động sản lẫn phòng. Phân biệt qua `loai_doi_tuong`.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `ma_hinh_anh` | SERIAL PK | Mã ảnh |
| `loai_doi_tuong` | VARCHAR(20) | `bat_dong_san` hoặc `phong` |
| `ma_doi_tuong` | INT | ID của bất động sản hoặc phòng |
| `duong_dan_anh` | TEXT | Đường dẫn file ảnh |
| `la_anh_chinh` | BOOLEAN | Ảnh đại diện chính |

### 4. `phong` - Phòng cho thuê

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `ma_phong` | SERIAL PK | Mã phòng |
| `ma_bat_dong_san` | INT FK | Thuộc bất động sản nào |
| `so_phong` | VARCHAR(20) | Số phòng |
| `tang` | INT | Tầng |
| `dien_tich` | DECIMAL(6,2) | Diện tích (m²) |
| `gia_thue` | DECIMAL(12,2) | Giá thuê tháng (VNĐ) |
| `tien_dat_coc` | DECIMAL(12,2) | Tiền cọc |
| `trang_thai` | VARCHAR(20) | `trong` / `da_thue` / `bao_tri` |
| `tien_nghi` | JSONB | Tiện nghi (wifi, điều hòa, ...) |
| `so_nguoi_toi_da` | INT | Số người tối đa |

### 5. `hop_dong` - Hợp đồng thuê nhà
Liên kết với smart contract trên blockchain.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `ma_hop_dong` | SERIAL PK | Mã hợp đồng |
| `ma_phong` | INT FK | Phòng thuê |
| `ma_nguoi_thue` | INT FK | Người thuê |
| `ma_chu_nha` | INT FK | Chủ nhà |
| `ngay_bat_dau`, `ngay_ket_thuc` | DATE | Thời hạn hợp đồng |
| `tien_thue_hang_thang` | DECIMAL(12,2) | Giá thuê hàng tháng |
| `tien_dat_coc` | DECIMAL(12,2) | Tiền cọc |
| `ngay_thanh_toan_hang_thang` | SMALLINT | Ngày thanh toán (1–28) |
| `trang_thai` | VARCHAR(20) | `cho_duyet` / `dang_hieu_luc` / `het_han` / `da_huy` |
| `ma_giao_dich_blockchain` | VARCHAR(66) | Hash tx tạo hợp đồng on-chain |
| `dia_chi_hop_dong_bc` | VARCHAR(42) | Địa chỉ smart contract |

### 6. `dich_vu` - Dịch vụ
Dịch vụ đi kèm bất động sản: điện, nước, internet, rác, giữ xe...

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `ten_dich_vu` | VARCHAR(100) | Tên dịch vụ |
| `don_gia` | DECIMAL(10,2) | Đơn giá |
| `don_vi` | VARCHAR(20) | Đơn vị (kWh, m3, tháng) |

### 7. `su_dung_dich_vu` - Sử dụng dịch vụ
Ghi nhận mức sử dụng dịch vụ hàng tháng cho từng hợp đồng.
Ràng buộc UNIQUE trên `(ma_hop_dong, ma_dich_vu, thang_tinh_tien)`.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `thang_tinh_tien` | DATE | Tháng (lưu ngày đầu tháng: 2026-01-01) |
| `chi_so_cu` | DECIMAL | Chỉ số cũ |
| `chi_so_moi` | DECIMAL | Chỉ số mới |
| `so_luong_su_dung` | DECIMAL | Lượng tiêu thụ |
| `thanh_tien` | DECIMAL | Thành tiền |

### 8. `hoa_don` - Hóa đơn
Hóa đơn tổng hợp hàng tháng = tiền thuê + dịch vụ + phí khác − giảm giá.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `tien_thue` | DECIMAL | Tiền thuê |
| `tong_tien_dich_vu` | DECIMAL | Tổng tiền dịch vụ |
| `phi_khac` | DECIMAL | Phí khác |
| `giam_gia` | DECIMAL | Giảm giá |
| `tong_tien` | DECIMAL | Tổng cộng |
| `trang_thai` | VARCHAR(20) | `chua_thanh_toan` / `da_thanh_toan` / `qua_han` / `da_huy` |
| `han_thanh_toan` | DATE | Hạn thanh toán |

### 9. `thanh_toan` - Thanh toán
Hỗ trợ 3 phương thức: `tien_mat`, `chuyen_khoan`, `crypto`.
Với crypto, lưu `ma_giao_dich_blockchain` để truy vết on-chain.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `phuong_thuc` | VARCHAR(20) | `tien_mat` / `chuyen_khoan` / `crypto` |
| `trang_thai` | VARCHAR(20) | `cho_xu_ly` / `thanh_cong` / `that_bai` |
| `ma_giao_dich_blockchain` | VARCHAR(66) | Hash giao dịch (nếu crypto) |

### 10. `yeu_cau_sua_chua` - Yêu cầu sửa chữa
Báo sự cố từ người thuê gửi đến chủ nhà.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `danh_muc` | VARCHAR(20) | `dien` / `nuoc` / `noi_that` / `thiet_bi` / `khac` |
| `muc_do_uu_tien` | VARCHAR(10) | `thap` / `trung_binh` / `cao` / `khan_cap` |
| `trang_thai` | VARCHAR(20) | `cho_xu_ly` / `dang_xu_ly` / `hoan_thanh` / `tu_choi` |
| `hinh_anh` | JSONB | Mảng URL ảnh minh chứng |

### 11. `thong_bao` - Thông báo
Thông báo gửi đến người dùng. Dùng polymorphic reference qua `loai_lien_quan` + `ma_lien_quan`.

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `loai` | VARCHAR(20) | `thanh_toan` / `hop_dong` / `sua_chua` / `he_thong` |
| `da_doc` | BOOLEAN | Đã đọc chưa |
| `loai_lien_quan` | VARCHAR(50) | Tên bảng liên quan |
| `ma_lien_quan` | INT | ID bản ghi liên quan |

---

## Luồng dữ liệu chính

```
Chủ nhà đăng ký
       |
       v
Tạo bat_dong_san + phong + dich_vu
       |
       v
Người thuê tìm phòng --> Tạo hop_dong
       |                        |
       |                        v
       |              Smart Contract trên Blockchain
       |                        |
       |                        v
       |              Lưu ma_giao_dich_blockchain vào hop_dong
       |
       v
Hàng tháng: Ghi su_dung_dich_vu --> Tạo hoa_don
                                         |
                                         v
                                    thanh_toan
                                   /           \
                             Crypto           Tiền mặt/CK
                               |                  |
                               v                  v
                    lưu ma_giao_dich_bc       trang_thai = thanh_cong
       |
       v
Người thuê báo sự cố --> yeu_cau_sua_chua
```

---

## Cấu trúc file

```
database/
  ├── schema.sql    -- Tạo bảng, index, ràng buộc (PostgreSQL)
  ├── seed.sql      -- Dữ liệu mẫu để demo
  ├── setup.ps1     -- Script PowerShell: tạo DB + chạy schema + seed
  └── README.md     -- Tài liệu này
```
