-- ============================================================
-- dApp Quản Lý Thuê Nhà - Database Schema
-- PostgreSQL 14+
-- ============================================================
-- CREATE DATABASE quanlythuenha;
-- ============================================================
-- 1. nguoi_dung - Người dùng (Admin / Chủ nhà / Người thuê)
-- ============================================================
CREATE TABLE nguoi_dung (
    ma_nguoi_dung       SERIAL          PRIMARY KEY,
    dia_chi_vi          VARCHAR(42)     NULL UNIQUE,
    ho_ten              VARCHAR(100)    NOT NULL,
    email               VARCHAR(100)    NOT NULL UNIQUE,
    so_dien_thoai       VARCHAR(15)     NULL,
    mat_khau_hash       VARCHAR(255)    NOT NULL,
    so_cccd             VARCHAR(20)     NULL UNIQUE,
    anh_cccd_mat_truoc  TEXT            NULL,
    anh_cccd_mat_sau    TEXT            NULL,
    anh_dai_dien        TEXT            NULL,
    vai_tro             VARCHAR(20)     NOT NULL DEFAULT 'nguoi_thue'
                            CHECK (vai_tro IN ('admin', 'chu_nha', 'nguoi_thue')),
    da_xac_thuc         BOOLEAN         NOT NULL DEFAULT false,
    dang_hoat_dong      BOOLEAN         NOT NULL DEFAULT true,
    ngay_tao            TIMESTAMP       NOT NULL DEFAULT NOW(),
    ngay_cap_nhat       TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nguoi_dung_sdt    ON nguoi_dung (so_dien_thoai);
CREATE INDEX idx_nguoi_dung_vaitro ON nguoi_dung (vai_tro);


-- ============================================================
-- 2. bat_dong_san - Bất động sản (tòa nhà / nhà trọ)
-- ============================================================
CREATE TABLE bat_dong_san (
    ma_bat_dong_san     SERIAL          PRIMARY KEY,
    ma_chu_so_huu      INT             NOT NULL,
    ten                 VARCHAR(200)    NOT NULL,
    dia_chi             VARCHAR(500)    NOT NULL,
    thanh_pho           VARCHAR(100)    NOT NULL,
    quan_huyen          VARCHAR(100)    NOT NULL,
    phuong_xa           VARCHAR(100)    NULL,
    mo_ta               TEXT            NULL,
    loai_bat_dong_san   VARCHAR(30)     NOT NULL DEFAULT 'nha_tro'
                            CHECK (loai_bat_dong_san IN ('chung_cu', 'nha_o', 'nha_tro')),
    tong_so_phong       INT             NOT NULL DEFAULT 0,
    vi_do               DECIMAL(10, 8)  NULL,
    kinh_do             DECIMAL(11, 8)  NULL,
    ngay_tao            TIMESTAMP       NOT NULL DEFAULT NOW(),
    ngay_cap_nhat       TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_bds_chu_so_huu
        FOREIGN KEY (ma_chu_so_huu) REFERENCES nguoi_dung (ma_nguoi_dung)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_bds_chu_so_huu ON bat_dong_san (ma_chu_so_huu);
CREATE INDEX idx_bds_dia_diem   ON bat_dong_san (thanh_pho, quan_huyen);


-- ============================================================
-- 3. hinh_anh - Ảnh (bất động sản hoặc phòng)
-- ============================================================
CREATE TABLE hinh_anh (
    ma_hinh_anh         SERIAL          PRIMARY KEY,
    -- 'bat_dong_san' hoặc 'phong'
    loai_doi_tuong      VARCHAR(20)     NOT NULL
                            CHECK (loai_doi_tuong IN ('bat_dong_san', 'phong')),
    ma_doi_tuong        INT             NOT NULL,
    duong_dan_anh       TEXT            NOT NULL,
    la_anh_chinh        BOOLEAN         NOT NULL DEFAULT false,
    ngay_tao            TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hinh_anh_doi_tuong ON hinh_anh (loai_doi_tuong, ma_doi_tuong);


-- ============================================================
-- 4. phong - Phòng cho thuê
-- ============================================================
CREATE TABLE phong (
    ma_phong            SERIAL          PRIMARY KEY,
    ma_bat_dong_san     INT             NOT NULL,
    so_phong            VARCHAR(20)     NOT NULL,
    tang                INT             NOT NULL DEFAULT 1,
    dien_tich           DECIMAL(6, 2)   NOT NULL,
    gia_thue            DECIMAL(12, 2)  NOT NULL,
    tien_dat_coc        DECIMAL(12, 2)  NOT NULL DEFAULT 0,
    trang_thai          VARCHAR(20)     NOT NULL DEFAULT 'trong'
                            CHECK (trang_thai IN ('trong', 'da_thue', 'bao_tri')),
    mo_ta               TEXT            NULL,
    tien_nghi           JSONB           NULL,
    so_nguoi_toi_da     INT             NOT NULL DEFAULT 2,
    ngay_tao            TIMESTAMP       NOT NULL DEFAULT NOW(),
    ngay_cap_nhat       TIMESTAMP       NOT NULL DEFAULT NOW(),

    UNIQUE (ma_bat_dong_san, so_phong),

    CONSTRAINT fk_phong_bds
        FOREIGN KEY (ma_bat_dong_san) REFERENCES bat_dong_san (ma_bat_dong_san)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_phong_bds_trangthai ON phong (ma_bat_dong_san, trang_thai);


-- ============================================================
-- 5. hop_dong - Hợp đồng thuê nhà
-- ============================================================
CREATE TABLE hop_dong (
    ma_hop_dong             SERIAL          PRIMARY KEY,
    ma_phong                INT             NOT NULL,
    ma_nguoi_thue           INT             NOT NULL,
    ma_chu_nha              INT             NOT NULL,
    ngay_bat_dau            DATE            NOT NULL,
    ngay_ket_thuc           DATE            NOT NULL,
    tien_thue_hang_thang    DECIMAL(12, 2)  NOT NULL,
    tien_dat_coc            DECIMAL(12, 2)  NOT NULL DEFAULT 0,
    ngay_thanh_toan_hang_thang SMALLINT    NOT NULL DEFAULT 5
                                CHECK (ngay_thanh_toan_hang_thang BETWEEN 1 AND 28),
    dieu_khoan              TEXT            NULL,
    trang_thai              VARCHAR(20)     NOT NULL DEFAULT 'cho_duyet'
                                CHECK (trang_thai IN ('cho_duyet', 'dang_hieu_luc', 'het_han', 'da_huy')),
    ma_giao_dich_blockchain VARCHAR(66)     NULL,
    dia_chi_hop_dong_bc     VARCHAR(42)     NULL,
    thoi_gian_ky            TIMESTAMP       NULL,
    ngay_tao                TIMESTAMP       NOT NULL DEFAULT NOW(),
    ngay_cap_nhat           TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_hop_dong_ngay CHECK (ngay_ket_thuc > ngay_bat_dau),

    CONSTRAINT fk_hop_dong_phong
        FOREIGN KEY (ma_phong) REFERENCES phong (ma_phong)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_hop_dong_nguoi_thue
        FOREIGN KEY (ma_nguoi_thue) REFERENCES nguoi_dung (ma_nguoi_dung)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_hop_dong_chu_nha
        FOREIGN KEY (ma_chu_nha) REFERENCES nguoi_dung (ma_nguoi_dung)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_hop_dong_nguoi_thue ON hop_dong (ma_nguoi_thue, trang_thai);
CREATE INDEX idx_hop_dong_phong      ON hop_dong (ma_phong, trang_thai);
CREATE INDEX idx_hop_dong_chu_nha    ON hop_dong (ma_chu_nha);
CREATE INDEX idx_hop_dong_bc_tx      ON hop_dong (ma_giao_dich_blockchain);
CREATE INDEX idx_hop_dong_ngay       ON hop_dong (ngay_bat_dau, ngay_ket_thuc);


-- ============================================================
-- 6. dich_vu - Dịch vụ (điện / nước / internet / rác...)
-- ============================================================
CREATE TABLE dich_vu (
    ma_dich_vu          SERIAL          PRIMARY KEY,
    ma_bat_dong_san     INT             NOT NULL,
    ten_dich_vu         VARCHAR(100)    NOT NULL,
    don_gia             DECIMAL(10, 2)  NOT NULL,
    don_vi              VARCHAR(20)     NOT NULL,
    dang_hoat_dong      BOOLEAN         NOT NULL DEFAULT true,
    ngay_tao            TIMESTAMP       NOT NULL DEFAULT NOW(),
    ngay_cap_nhat       TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_dich_vu_bds
        FOREIGN KEY (ma_bat_dong_san) REFERENCES bat_dong_san (ma_bat_dong_san)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_dich_vu_bds ON dich_vu (ma_bat_dong_san);


-- ============================================================
-- 7. su_dung_dich_vu - Ghi nhận sử dụng dịch vụ hàng tháng
-- ============================================================
CREATE TABLE su_dung_dich_vu (
    ma_su_dung          SERIAL          PRIMARY KEY,
    ma_hop_dong         INT             NOT NULL,
    ma_dich_vu          INT             NOT NULL,
    -- Lưu ngày đầu tháng: VD 2025-01-01
    thang_tinh_tien     DATE            NOT NULL,
    chi_so_cu           DECIMAL(10, 2)  NOT NULL DEFAULT 0,
    chi_so_moi          DECIMAL(10, 2)  NOT NULL DEFAULT 0,
    so_luong_su_dung    DECIMAL(10, 2)  NOT NULL DEFAULT 0,
    thanh_tien          DECIMAL(12, 2)  NOT NULL DEFAULT 0,
    ngay_tao            TIMESTAMP       NOT NULL DEFAULT NOW(),

    UNIQUE (ma_hop_dong, ma_dich_vu, thang_tinh_tien),

    CONSTRAINT chk_chi_so CHECK (chi_so_moi >= chi_so_cu),

    CONSTRAINT fk_su_dung_hop_dong
        FOREIGN KEY (ma_hop_dong) REFERENCES hop_dong (ma_hop_dong)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_su_dung_dich_vu
        FOREIGN KEY (ma_dich_vu) REFERENCES dich_vu (ma_dich_vu)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_su_dung_thang ON su_dung_dich_vu (thang_tinh_tien);


-- ============================================================
-- 8. hoa_don - Hóa đơn tổng hợp hàng tháng
-- ============================================================
CREATE TABLE hoa_don (
    ma_hoa_don          SERIAL          PRIMARY KEY,
    ma_hop_dong         INT             NOT NULL,
    thang_tinh_tien     DATE            NOT NULL,
    tien_thue           DECIMAL(12, 2)  NOT NULL,
    tong_tien_dich_vu   DECIMAL(12, 2)  NOT NULL DEFAULT 0,
    phi_khac            DECIMAL(12, 2)  NOT NULL DEFAULT 0,
    giam_gia            DECIMAL(12, 2)  NOT NULL DEFAULT 0,
    tong_tien           DECIMAL(12, 2)  NOT NULL,
    trang_thai          VARCHAR(20)     NOT NULL DEFAULT 'chua_thanh_toan'
                            CHECK (trang_thai IN ('chua_thanh_toan', 'da_thanh_toan', 'qua_han', 'da_huy')),
    han_thanh_toan      DATE            NOT NULL,
    ghi_chu             TEXT            NULL,
    ngay_tao            TIMESTAMP       NOT NULL DEFAULT NOW(),
    ngay_cap_nhat       TIMESTAMP       NOT NULL DEFAULT NOW(),

    UNIQUE (ma_hop_dong, thang_tinh_tien),

    CONSTRAINT fk_hoa_don_hop_dong
        FOREIGN KEY (ma_hop_dong) REFERENCES hop_dong (ma_hop_dong)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_hoa_don_trangthai_han ON hoa_don (trang_thai, han_thanh_toan);


-- ============================================================
-- 9. thanh_toan - Ghi nhận thanh toán
-- ============================================================
CREATE TABLE thanh_toan (
    ma_thanh_toan           SERIAL          PRIMARY KEY,
    ma_hoa_don              INT             NOT NULL,
    ma_nguoi_thanh_toan     INT             NOT NULL,
    so_tien                 DECIMAL(12, 2)  NOT NULL,
    phuong_thuc             VARCHAR(20)     NOT NULL
                                CHECK (phuong_thuc IN ('tien_mat', 'chuyen_khoan', 'crypto')),
    ma_giao_dich_blockchain VARCHAR(66)     NULL,
    trang_thai              VARCHAR(20)     NOT NULL DEFAULT 'cho_xu_ly'
                                CHECK (trang_thai IN ('cho_xu_ly', 'thanh_cong', 'that_bai')),
    thoi_gian_thanh_toan    TIMESTAMP       NULL,
    ngay_tao                TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_thanh_toan_hoa_don
        FOREIGN KEY (ma_hoa_don) REFERENCES hoa_don (ma_hoa_don)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_thanh_toan_nguoi
        FOREIGN KEY (ma_nguoi_thanh_toan) REFERENCES nguoi_dung (ma_nguoi_dung)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_thanh_toan_hoa_don  ON thanh_toan (ma_hoa_don);
CREATE INDEX idx_thanh_toan_nguoi    ON thanh_toan (ma_nguoi_thanh_toan);
CREATE INDEX idx_thanh_toan_bc_tx    ON thanh_toan (ma_giao_dich_blockchain);
CREATE INDEX idx_thanh_toan_tt       ON thanh_toan (trang_thai);


-- ============================================================
-- 10. yeu_cau_sua_chua - Yêu cầu sửa chữa / báo sự cố
-- ============================================================
CREATE TABLE yeu_cau_sua_chua (
    ma_yeu_cau          SERIAL          PRIMARY KEY,
    ma_phong            INT             NOT NULL,
    ma_nguoi_thue       INT             NOT NULL,
    tieu_de             VARCHAR(200)    NOT NULL,
    mo_ta               TEXT            NULL,
    danh_muc            VARCHAR(20)     NOT NULL DEFAULT 'khac'
                            CHECK (danh_muc IN ('dien', 'nuoc', 'noi_that', 'thiet_bi', 'khac')),
    muc_do_uu_tien      VARCHAR(10)     NOT NULL DEFAULT 'trung_binh'
                            CHECK (muc_do_uu_tien IN ('thap', 'trung_binh', 'cao', 'khan_cap')),
    trang_thai          VARCHAR(20)     NOT NULL DEFAULT 'cho_xu_ly'
                            CHECK (trang_thai IN ('cho_xu_ly', 'dang_xu_ly', 'hoan_thanh', 'tu_choi')),
    hinh_anh            JSONB           NULL,
    thoi_gian_hoan_thanh TIMESTAMP     NULL,
    ghi_chu_hoan_thanh  TEXT            NULL,
    ngay_tao            TIMESTAMP       NOT NULL DEFAULT NOW(),
    ngay_cap_nhat       TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_sua_chua_phong
        FOREIGN KEY (ma_phong) REFERENCES phong (ma_phong)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_sua_chua_nguoi_thue
        FOREIGN KEY (ma_nguoi_thue) REFERENCES nguoi_dung (ma_nguoi_dung)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_sua_chua_phong      ON yeu_cau_sua_chua (ma_phong);
CREATE INDEX idx_sua_chua_nguoi_thue ON yeu_cau_sua_chua (ma_nguoi_thue);
CREATE INDEX idx_sua_chua_trangthai  ON yeu_cau_sua_chua (trang_thai);


-- ============================================================
-- 11. thong_bao - Thông báo
-- ============================================================
CREATE TABLE thong_bao (
    ma_thong_bao        SERIAL          PRIMARY KEY,
    ma_nguoi_dung       INT             NOT NULL,
    tieu_de             VARCHAR(200)    NOT NULL,
    noi_dung            TEXT            NOT NULL,
    loai                VARCHAR(20)     NOT NULL DEFAULT 'he_thong'
                            CHECK (loai IN ('thanh_toan', 'hop_dong', 'sua_chua', 'he_thong')),
    da_doc              BOOLEAN         NOT NULL DEFAULT false,
    loai_lien_quan      VARCHAR(50)     NULL,
    ma_lien_quan        INT             NULL,
    ngay_tao            TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_thong_bao_nguoi_dung
        FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung (ma_nguoi_dung)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_thong_bao_nguoi_doc ON thong_bao (ma_nguoi_dung, da_doc);
CREATE INDEX idx_thong_bao_loai      ON thong_bao (loai);
