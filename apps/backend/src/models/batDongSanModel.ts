import pool from "../config/db";

export interface BatDongSan {
  ma_bat_dong_san: number;
  ma_chu_so_huu: number;
  ten: string;
  dia_chi: string;
  thanh_pho: string;
  quan_huyen: string;
  phuong_xa?: string;
  mo_ta?: string;
  loai_bat_dong_san: "chung_cu" | "nha_o" | "nha_tro";
  dien_tich: number;
  gia_thue: number;
  tien_dat_coc: number;
  trang_thai: "trong" | "da_thue" | "bao_tri";
  tien_nghi?: any;
  so_nguoi_toi_da: number;
  vi_do?: number;
  kinh_do?: number;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
}

export interface CreateBatDongSanDTO {
  ma_chu_so_huu: number;
  ten: string;
  dia_chi: string;
  thanh_pho: string;
  quan_huyen: string;
  phuong_xa?: string;
  mo_ta?: string;
  loai_bat_dong_san?: "chung_cu" | "nha_o" | "nha_tro";
  dien_tich?: number;
  gia_thue?: number;
  tien_dat_coc?: number;
  trang_thai?: "trong" | "da_thue" | "bao_tri";
  tien_nghi?: any;
  so_nguoi_toi_da?: number;
  vi_do?: number;
  kinh_do?: number;
}

export interface UpdateBatDongSanDTO {
  ten?: string;
  dia_chi?: string;
  thanh_pho?: string;
  quan_huyen?: string;
  phuong_xa?: string;
  mo_ta?: string;
  loai_bat_dong_san?: "chung_cu" | "nha_o" | "nha_tro";
  dien_tich?: number;
  gia_thue?: number;
  tien_dat_coc?: number;
  trang_thai?: "trong" | "da_thue" | "bao_tri";
  tien_nghi?: any;
  so_nguoi_toi_da?: number;
  vi_do?: number;
  kinh_do?: number;
}

// Lấy danh sách BĐS (có phân trang)
export const getAllBatDongSan = async (
  limit: number = 20,
  offset: number = 0
): Promise<BatDongSan[]> => {
  const result = await pool.query<BatDongSan>(
    `SELECT * FROM bat_dong_san ORDER BY ngay_tao DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

// Lấy chi tiết BĐS
export const getBatDongSanById = async (id: number): Promise<BatDongSan | null> => {
  const result = await pool.query<BatDongSan>(
    `SELECT * FROM bat_dong_san WHERE ma_bat_dong_san = $1`,
    [id]
  );
  return result.rows[0] || null;
};

// Tạo BĐS mới
export const createBatDongSan = async (data: CreateBatDongSanDTO): Promise<BatDongSan> => {
  const result = await pool.query<BatDongSan>(
    `INSERT INTO bat_dong_san 
      (ma_chu_so_huu, ten, dia_chi, thanh_pho, quan_huyen, phuong_xa, mo_ta, loai_bat_dong_san,
       dien_tich, gia_thue, tien_dat_coc, trang_thai, tien_nghi, so_nguoi_toi_da,
       vi_do, kinh_do, ngay_tao, ngay_cap_nhat)
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'nha_o'), 
       COALESCE($9, 0), COALESCE($10, 0), COALESCE($11, 0), COALESCE($12, 'trong'), $13, COALESCE($14, 2),
       $15, $16, NOW(), NOW())
     RETURNING *`,
    [
      data.ma_chu_so_huu,
      data.ten,
      data.dia_chi,
      data.thanh_pho,
      data.quan_huyen,
      data.phuong_xa || null,
      data.mo_ta || null,
      data.loai_bat_dong_san || null,
      data.dien_tich || null,
      data.gia_thue || null,
      data.tien_dat_coc || null,
      data.trang_thai || null,
      data.tien_nghi ? JSON.stringify(data.tien_nghi) : null,
      data.so_nguoi_toi_da || null,
      data.vi_do || null,
      data.kinh_do || null,
    ]
  );
  return result.rows[0];
};

// Cập nhật BĐS
export const updateBatDongSan = async (
  id: number,
  data: UpdateBatDongSanDTO
): Promise<BatDongSan | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.ten) { fields.push(`ten = $${idx++}`); values.push(data.ten); }
  if (data.dia_chi) { fields.push(`dia_chi = $${idx++}`); values.push(data.dia_chi); }
  if (data.thanh_pho) { fields.push(`thanh_pho = $${idx++}`); values.push(data.thanh_pho); }
  if (data.quan_huyen) { fields.push(`quan_huyen = $${idx++}`); values.push(data.quan_huyen); }
  if (data.phuong_xa !== undefined) { fields.push(`phuong_xa = $${idx++}`); values.push(data.phuong_xa); }
  if (data.mo_ta !== undefined) { fields.push(`mo_ta = $${idx++}`); values.push(data.mo_ta); }
  if (data.loai_bat_dong_san) { fields.push(`loai_bat_dong_san = $${idx++}`); values.push(data.loai_bat_dong_san); }
  
  if (data.dien_tich !== undefined) { fields.push(`dien_tich = $${idx++}`); values.push(data.dien_tich); }
  if (data.gia_thue !== undefined) { fields.push(`gia_thue = $${idx++}`); values.push(data.gia_thue); }
  if (data.tien_dat_coc !== undefined) { fields.push(`tien_dat_coc = $${idx++}`); values.push(data.tien_dat_coc); }
  if (data.trang_thai) { fields.push(`trang_thai = $${idx++}`); values.push(data.trang_thai); }
  if (data.tien_nghi !== undefined) { fields.push(`tien_nghi = $${idx++}`); values.push(data.tien_nghi ? JSON.stringify(data.tien_nghi) : null); }
  if (data.so_nguoi_toi_da !== undefined) { fields.push(`so_nguoi_toi_da = $${idx++}`); values.push(data.so_nguoi_toi_da); }

  if (data.vi_do !== undefined) { fields.push(`vi_do = $${idx++}`); values.push(data.vi_do); }
  if (data.kinh_do !== undefined) { fields.push(`kinh_do = $${idx++}`); values.push(data.kinh_do); }

  if (fields.length === 0) return await getBatDongSanById(id);

  fields.push(`ngay_cap_nhat = NOW()`);
  values.push(id);

  const result = await pool.query<BatDongSan>(
    `UPDATE bat_dong_san SET ${fields.join(", ")} WHERE ma_bat_dong_san = $${idx} RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

// Xóa BĐS
export const deleteBatDongSan = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    `DELETE FROM bat_dong_san WHERE ma_bat_dong_san = $1 RETURNING ma_bat_dong_san`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
};
