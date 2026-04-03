-- ============================================================
-- dApp Quan Ly Thue Nha - Seed Data (Du lieu mau)
-- PostgreSQL 14+
-- Chay sau khi da tao schema: \i database/schema.sql
-- ============================================================

-- Bat buoc: set encoding UTF-8 cho psql tren Windows
SET client_encoding = 'UTF8';

-- ============================================================
-- 1. nguoi_dung
-- mat_khau_hash = bcrypt('123456')
-- ============================================================
INSERT INTO nguoi_dung (dia_chi_vi, ho_ten, email, so_dien_thoai, mat_khau_hash, so_cccd, vai_tro, da_xac_thuc) VALUES
('0x1234567890abcdef1234567890abcdef12345678', 'Nguyễn Văn Admin',  'admin@rental.vn',    '0901000001', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ12', '001099000001', 'admin',    true),
('0xABCDEF1234567890ABCDEF1234567890ABCDEF12', 'Trần Văn Chủ Nhà', 'chunha01@rental.vn', '0901000002', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ12', '001099000002', 'chu_nha',  true),
('0x9876543210FEDCBA9876543210FEDCBA98765432', 'Lê Thị Chủ Trọ',   'chunha02@rental.vn', '0901000003', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ12', '001099000003', 'chu_nha',  true),
('0xAAAABBBBCCCCDDDD1111222233334444AAAABBBB', 'Phạm Minh Thuê',   'thue01@rental.vn',   '0901000004', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ12', '001099000004', 'nguoi_thue', true),
('0x5555666677778888AAAABBBBCCCCDDDD55556666', 'Hoàng Thị Lan',    'thue02@rental.vn',   '0901000005', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ12', '001099000005', 'nguoi_thue', true),
('0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF', 'Vũ Đức Nam',     'thue03@rental.vn',   '0901000006', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ12', '001099000006', 'nguoi_thue', false);

-- ============================================================
-- 2. bat_dong_san
-- ============================================================
INSERT INTO bat_dong_san (ma_chu_so_huu, ten, dia_chi, thanh_pho, quan_huyen, phuong_xa, mo_ta, loai_bat_dong_san, tong_so_phong, vi_do, kinh_do) VALUES
(2, 'Nhà trọ Thành Công',    '12 Ngõ 45 Phạm Ngọc Thạch',  'Hà Nội',         'Đống Đa',     'Phương Liên', 'Nhà trọ cao cấp, gần trường đại học GTVT',      'nha_tro',   10, 21.00320000, 105.83440000),
(2, 'Chung cư Mini Sunrise', '88 Trần Đại Nghĩa',           'Hà Nội',         'Hai Bà Trưng','Bách Khoa',   'Chung cư mini đầy đủ tiện nghi cho sinh viên',  'chung_cu',   6, 21.00150000, 105.84720000),
(3, 'Nhà trọ Bình Minh',     '25 Đường Nguyễn Trãi',        'TP Hồ Chí Minh', 'Quận 5',      'Phường 3',    'Nhà trọ giá rẻ khu trung tâm',                  'nha_tro',    8, 10.75890000, 106.67930000);

-- ============================================================
-- 3. hinh_anh (gộp property_images + room_images)
-- ============================================================
INSERT INTO hinh_anh (loai_doi_tuong, ma_doi_tuong, duong_dan_anh, la_anh_chinh) VALUES
-- Ảnh bất động sản
('bat_dong_san', 1, '/uploads/properties/1/front.jpg',    true),
('bat_dong_san', 1, '/uploads/properties/1/gate.jpg',     false),
('bat_dong_san', 2, '/uploads/properties/2/building.jpg', true),
('bat_dong_san', 3, '/uploads/properties/3/overview.jpg', true),
-- Ảnh phòng
('phong', 1, '/uploads/rooms/1/main.jpg',    true),
('phong', 1, '/uploads/rooms/1/bath.jpg',    false),
('phong', 3, '/uploads/rooms/3/main.jpg',    true),
('phong', 5, '/uploads/rooms/5/main.jpg',    true),
('phong', 5, '/uploads/rooms/5/kitchen.jpg', false),
('phong', 7, '/uploads/rooms/7/main.jpg',    true);

-- ============================================================
-- 4. phong
-- ============================================================
INSERT INTO phong (ma_bat_dong_san, so_phong, tang, dien_tich, gia_thue, tien_dat_coc, trang_thai, mo_ta, tien_nghi, so_nguoi_toi_da) VALUES
(1, '101', 1, 20.00, 3000000.00, 3000000.00, 'da_thue',  'Phòng tầng 1, có cửa sổ',          '{"wifi": true, "dieu_hoa": true, "cho_de_xe": true, "wc_rieng": true}', 2),
(1, '102', 1, 18.00, 2500000.00, 2500000.00, 'trong',    'Phòng tầng 1, gần cầu thang',       '{"wifi": true, "dieu_hoa": false, "cho_de_xe": true, "wc_rieng": true}', 2),
(1, '201', 2, 22.00, 3500000.00, 3500000.00, 'da_thue',  'Phòng tầng 2, view đẹp',            '{"wifi": true, "dieu_hoa": true, "cho_de_xe": true, "wc_rieng": true}', 3),
(1, '202', 2, 18.00, 2800000.00, 2800000.00, 'bao_tri',  'Phòng đang sửa chữa',               '{"wifi": true, "dieu_hoa": true, "cho_de_xe": false, "wc_rieng": true}', 2),
(2, 'A01', 1, 30.00, 4500000.00, 4500000.00, 'da_thue',  'Studio cao cấp, ban công rộng',     '{"wifi": true, "dieu_hoa": true, "cho_de_xe": true, "wc_rieng": true, "bep": true}', 2),
(2, 'A02', 1, 25.00, 3800000.00, 3800000.00, 'trong',    'Studio tiêu chuẩn',                 '{"wifi": true, "dieu_hoa": true, "cho_de_xe": false, "wc_rieng": true, "bep": true}', 2),
(3, 'P01', 1, 16.00, 2000000.00, 2000000.00, 'da_thue',  'Phòng nhỏ gọn, tiện nghi cơ bản',  '{"wifi": true, "dieu_hoa": false, "cho_de_xe": true, "wc_rieng": false}', 1),
(3, 'P02', 1, 20.00, 2500000.00, 2500000.00, 'trong',    'Phòng rộng có WC riêng',            '{"wifi": true, "dieu_hoa": true, "cho_de_xe": true, "wc_rieng": true}', 2);

-- ============================================================
-- 5. hop_dong
-- ============================================================
INSERT INTO hop_dong (ma_phong, ma_nguoi_thue, ma_chu_nha, ngay_bat_dau, ngay_ket_thuc, tien_thue_hang_thang, tien_dat_coc, ngay_thanh_toan_hang_thang, dieu_khoan, trang_thai, ma_giao_dich_blockchain, dia_chi_hop_dong_bc, thoi_gian_ky) VALUES
(1, 4, 2, '2025-01-01', '2026-01-01', 3000000.00, 3000000.00, 5,  'Hợp đồng 12 tháng. Thanh toán trước ngày 5 hàng tháng.', 'dang_hieu_luc', '0xabc123def456789012345678901234567890abcdef1234567890abcdef123456', '0xContractAddr1000000000000000000000000001', '2025-01-01 09:00:00'),
(3, 5, 2, '2025-03-15', '2026-03-15', 3500000.00, 3500000.00, 10, 'Hợp đồng 12 tháng. Bao gồm wifi.',                       'dang_hieu_luc', '0xdef789abc123456789012345678901234567890abcdef1234567890abcdef789', '0xContractAddr2000000000000000000000000002', '2025-03-15 10:30:00'),
(5, 4, 2, '2024-06-01', '2025-06-01', 4500000.00, 4500000.00, 5,  'Hợp đồng studio, đã hết hạn.',                            'het_han',       '0x111222333444555666777888999000aaabbbcccdddeeefff111222333444555',  NULL,                                         '2024-06-01 08:00:00'),
(7, 6, 3, '2025-06-01', '2026-06-01', 2000000.00, 2000000.00, 1,  'Hợp đồng 12 tháng tại nhà trọ Bình Minh.',               'dang_hieu_luc', '0x999888777666555444333222111000fffeeedddcccbbbaaa999888777666555',  '0xContractAddr4000000000000000000000000004', '2025-06-01 14:00:00');

-- ============================================================
-- 6. dich_vu
-- ============================================================
INSERT INTO dich_vu (ma_bat_dong_san, ten_dich_vu, don_gia, don_vi) VALUES
(1, 'Điện',    3500.00,   'kWh'),
(1, 'Nước',    25000.00,  'm3'),
(1, 'Internet',100000.00, 'tháng'),
(1, 'Rác',     30000.00,  'tháng'),
(2, 'Điện',    3500.00,   'kWh'),
(2, 'Nước',    25000.00,  'm3'),
(2, 'Internet',0.00,      'tháng'),
(3, 'Điện',    3800.00,   'kWh'),
(3, 'Nước',    20000.00,  'm3'),
(3, 'Giữ xe',  100000.00, 'tháng');

-- ============================================================
-- 7. su_dung_dich_vu (tháng 01/2026)
-- ============================================================
INSERT INTO su_dung_dich_vu (ma_hop_dong, ma_dich_vu, thang_tinh_tien, chi_so_cu, chi_so_moi, so_luong_su_dung, thanh_tien) VALUES
(1, 1, '2026-01-01', 1200.00, 1285.00, 85.00, 297500.00),
(1, 2, '2026-01-01',   50.00,   54.00,  4.00, 100000.00),
(1, 3, '2026-01-01',    0.00,    0.00,  1.00, 100000.00),
(1, 4, '2026-01-01',    0.00,    0.00,  1.00,  30000.00),
(2, 1, '2026-01-01',  800.00,  892.00, 92.00, 322000.00),
(2, 2, '2026-01-01',   30.00,   35.00,  5.00, 125000.00),
(2, 3, '2026-01-01',    0.00,    0.00,  1.00, 100000.00),
(2, 4, '2026-01-01',    0.00,    0.00,  1.00,  30000.00);

-- su_dung_dich_vu (tháng 02/2026)
INSERT INTO su_dung_dich_vu (ma_hop_dong, ma_dich_vu, thang_tinh_tien, chi_so_cu, chi_so_moi, so_luong_su_dung, thanh_tien) VALUES
(1, 1, '2026-02-01', 1285.00, 1360.00, 75.00, 262500.00),
(1, 2, '2026-02-01',   54.00,   57.00,  3.00,  75000.00),
(1, 3, '2026-02-01',    0.00,    0.00,  1.00, 100000.00),
(1, 4, '2026-02-01',    0.00,    0.00,  1.00,  30000.00);

-- ============================================================
-- 8. hoa_don
-- ============================================================
INSERT INTO hoa_don (ma_hop_dong, thang_tinh_tien, tien_thue, tong_tien_dich_vu, phi_khac, giam_gia, tong_tien, trang_thai, han_thanh_toan, ghi_chu) VALUES
(1, '2026-01-01', 3000000.00, 527500.00, 0.00,      0.00, 3527500.00, 'da_thanh_toan',   '2026-01-05', NULL),
(2, '2026-01-01', 3500000.00, 577000.00, 0.00,      0.00, 4077000.00, 'da_thanh_toan',   '2026-01-10', NULL),
(1, '2026-02-01', 3000000.00, 467500.00, 0.00,      0.00, 3467500.00, 'chua_thanh_toan', '2026-02-05', NULL),
(4, '2026-01-01', 2000000.00, 350000.00, 0.00, 50000.00,  2300000.00, 'qua_han',         '2026-01-01', 'Quá hạn thanh toán');

-- ============================================================
-- 9. thanh_toan
-- ============================================================
INSERT INTO thanh_toan (ma_hoa_don, ma_nguoi_thanh_toan, so_tien, phuong_thuc, ma_giao_dich_blockchain, trang_thai, thoi_gian_thanh_toan) VALUES
(1, 4, 3527500.00, 'crypto',       '0xaa00000000000001abcdef1234567890abcdef1234567890abcdef1234567890', 'thanh_cong', '2026-01-04 15:30:00'),
(2, 5, 4077000.00, 'chuyen_khoan', NULL,                                                                 'thanh_cong', '2026-01-09 10:00:00'),
(4, 6, 1000000.00, 'tien_mat',     NULL,                                                                 'thanh_cong', '2026-01-15 08:00:00');

-- ============================================================
-- 10. yeu_cau_sua_chua
-- ============================================================
INSERT INTO yeu_cau_sua_chua (ma_phong, ma_nguoi_thue, tieu_de, mo_ta, danh_muc, muc_do_uu_tien, trang_thai, hinh_anh, thoi_gian_hoan_thanh, ghi_chu_hoan_thanh) VALUES
(1, 4, 'Vòi nước bị rỉ',      'Vòi nước trong nhà tắm bị rỉ nước liên tục, cần thay mới.',  'nuoc',     'cao',       'hoan_thanh', '["/uploads/maintenance/1/leak1.jpg"]', '2026-01-10 14:00:00', 'Đã thay vòi nước mới.'),
(3, 5, 'Điều hòa không lạnh', 'Điều hòa phòng khách bật nhưng không ra hơi lạnh.',          'thiet_bi', 'trung_binh','dang_xu_ly', '["/uploads/maintenance/2/ac1.jpg"]',   NULL,                 NULL),
(7, 6, 'Bóng đèn hỏng',       'Bóng đèn trong phòng tắm bị cháy, cần thay.',                'dien',     'thap',      'cho_xu_ly',  NULL,                                   NULL,                 NULL),
(1, 4, 'Cửa phòng kẹt',       'Cửa chính phòng bị kẹt, khó mở.',                            'noi_that', 'trung_binh','cho_xu_ly',  '["/uploads/maintenance/4/door1.jpg"]', NULL,                 NULL);

-- ============================================================
-- 11. thong_bao
-- ============================================================
INSERT INTO thong_bao (ma_nguoi_dung, tieu_de, noi_dung, loai, da_doc, loai_lien_quan, ma_lien_quan) VALUES
(4, 'Thanh toán thành công',  'Bạn đã thanh toán hóa đơn tháng 01/2026 thành công.',                    'thanh_toan',  true,  'hoa_don',           1),
(4, 'Hóa đơn tháng 02/2026', 'Hóa đơn tháng 02/2026 đã được tạo. Vui lòng thanh toán trước 05/02.',   'thanh_toan',  false, 'hoa_don',           3),
(5, 'Thanh toán thành công',  'Bạn đã thanh toán hóa đơn tháng 01/2026 qua chuyển khoản.',             'thanh_toan',  true,  'hoa_don',           2),
(6, 'Hóa đơn quá hạn',       'Hóa đơn tháng 01/2026 đã quá hạn. Vui lòng thanh toán sớm.',           'thanh_toan',  false, 'hoa_don',           4),
(4, 'Sự cố đã xử lý',        'Yêu cầu sửa vòi nước đã được xử lý xong.',                             'sua_chua',    true,  'yeu_cau_sua_chua',  1),
(2, 'Hợp đồng mới',          'Hợp đồng với Phạm Minh Thuê đã được ký thành công trên blockchain.',    'hop_dong',    true,  'hop_dong',          1),
(2, 'Có sự cố mới',          'Người thuê phòng 201 báo điều hòa không lạnh.',                         'sua_chua',    false, 'yeu_cau_sua_chua',  2);
