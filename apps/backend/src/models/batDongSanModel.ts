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
  so_phong_ngu: number;
  so_nguoi_toi_da: number;
  vi_do?: number;
  kinh_do?: number;
  anh_dai_dien?: string;
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
  so_phong_ngu?: number;
  so_nguoi_toi_da?: number;
  vi_do?: number;
  kinh_do?: number;
  anh_dai_dien?: string;
  anh_phu?: string[];
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
  so_phong_ngu?: number;
  so_nguoi_toi_da?: number;
  vi_do?: number;
  kinh_do?: number;
  anh_dai_dien?: string;
}

// Lấy danh sách BĐS (có phân trang và tìm kiếm)
export const getAllBatDongSan = async (
  limit: number = 20,
  offset: number = 0,
  filters: {
    search?: string;
    min_price?: number;
    max_price?: number;
    trang_thai?: string;
    so_phong_ngu?: number;
    tien_nghi?: string[];
    ma_chu_so_huu?: number;
  } = {}
): Promise<{ data: BatDongSan[], total: number }> => {
  let queryStr = `SELECT * FROM bat_dong_san WHERE 1=1`;
  let countQueryStr = `SELECT COUNT(*) FROM bat_dong_san WHERE 1=1`;
  const queryParams: any[] = [];
  let paramIdx = 1;

  if (filters.search) {
    queryStr += ` AND (ten ILIKE $${paramIdx} OR thanh_pho ILIKE $${paramIdx} OR quan_huyen ILIKE $${paramIdx})`;
    countQueryStr += ` AND (ten ILIKE $${paramIdx} OR thanh_pho ILIKE $${paramIdx} OR quan_huyen ILIKE $${paramIdx})`;
    queryParams.push(`%${filters.search}%`);
    paramIdx++;
  }
  if (filters.min_price !== undefined) {
    queryStr += ` AND gia_thue >= $${paramIdx}`;
    countQueryStr += ` AND gia_thue >= $${paramIdx}`;
    queryParams.push(filters.min_price);
    paramIdx++;
  }
  if (filters.max_price !== undefined) {
    queryStr += ` AND gia_thue <= $${paramIdx}`;
    countQueryStr += ` AND gia_thue <= $${paramIdx}`;
    queryParams.push(filters.max_price);
    paramIdx++;
  }
  if (filters.trang_thai) {
    queryStr += ` AND trang_thai = $${paramIdx}`;
    countQueryStr += ` AND trang_thai = $${paramIdx}`;
    queryParams.push(filters.trang_thai);
    paramIdx++;
  }
  if (filters.ma_chu_so_huu) {
    queryStr += ` AND ma_chu_so_huu = $${paramIdx}`;
    countQueryStr += ` AND ma_chu_so_huu = $${paramIdx}`;
    queryParams.push(filters.ma_chu_so_huu);
    paramIdx++;
  }
  if (filters.so_phong_ngu !== undefined) {
    if (filters.so_phong_ngu >= 5) {
      queryStr += ` AND so_phong_ngu >= $${paramIdx}`;
      countQueryStr += ` AND so_phong_ngu >= $${paramIdx}`;
    } else {
      queryStr += ` AND so_phong_ngu = $${paramIdx}`;
      countQueryStr += ` AND so_phong_ngu = $${paramIdx}`;
    }
    queryParams.push(filters.so_phong_ngu);
    paramIdx++;
  }
  if (filters.tien_nghi && filters.tien_nghi.length > 0) {
    filters.tien_nghi.forEach(amenity => {
      const amenityQuery = ` AND (
        CASE 
          WHEN jsonb_typeof(tien_nghi) = 'array' THEN tien_nghi @> jsonb_build_array($${paramIdx}::text)
          WHEN jsonb_typeof(tien_nghi) = 'object' THEN (tien_nghi ->> $${paramIdx}) = 'true'
          ELSE FALSE
        END
      )`;
      queryStr += amenityQuery;
      countQueryStr += amenityQuery;
      queryParams.push(amenity);
      paramIdx++;
    });
  }

  // Lấy tổng số lượng
  const countResult = await pool.query(countQueryStr, queryParams);
  const total = parseInt(countResult.rows[0].count);

  // Thêm phân trang cho dữ liệu
  queryStr += ` ORDER BY ngay_tao DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
  queryParams.push(limit, offset);

  const result = await pool.query<BatDongSan>(queryStr, queryParams);
  
  return { data: result.rows, total };
};

// Lấy chi tiết BĐS kèm ví chủ nhà và danh sách hình ảnh
export const getBatDongSanById = async (id: number): Promise<any | null> => {
  const result = await pool.query<any>(
    `SELECT b.*, n.dia_chi_vi as vi_chu_nha 
     FROM bat_dong_san b 
     JOIN nguoi_dung n ON b.ma_chu_so_huu = n.ma_nguoi_dung 
     WHERE b.ma_bat_dong_san = $1`,
    [id]
  );
  
  if (result.rows.length === 0) return null;
  const bds = result.rows[0];

  const imagesResult = await pool.query(
    `SELECT * FROM hinh_anh WHERE ma_bat_dong_san = $1 ORDER BY la_anh_chinh DESC, ngay_tao ASC`,
    [id]
  );
  bds.hinh_anh = imagesResult.rows;

  return bds;
};

// Alias for compatibility
export const findBatDongSanById = getBatDongSanById;

// Tạo BĐS mới
export const createBatDongSan = async (data: CreateBatDongSanDTO): Promise<BatDongSan> => {
  const result = await pool.query<BatDongSan>(
    `INSERT INTO bat_dong_san 
      (ma_chu_so_huu, ten, dia_chi, thanh_pho, quan_huyen, phuong_xa, mo_ta, loai_bat_dong_san,
       dien_tich, gia_thue, tien_dat_coc, trang_thai, tien_nghi, so_phong_ngu, so_nguoi_toi_da,
       vi_do, kinh_do, anh_dai_dien, ngay_tao, ngay_cap_nhat)
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'nha_o'), 
       COALESCE($9, 0::NUMERIC), COALESCE($10, 0::NUMERIC), COALESCE($11, 0::NUMERIC), COALESCE($12, 'trong'), $13, 
       COALESCE($14, 1), COALESCE($15, 2),
       $16::NUMERIC, $17::NUMERIC, $18, NOW(), NOW())
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
      data.tien_nghi ? (typeof data.tien_nghi === 'string' ? data.tien_nghi : JSON.stringify(data.tien_nghi)) : null,
      data.so_phong_ngu || null,
      data.so_nguoi_toi_da || null,
      data.vi_do || null,
      data.kinh_do || null,
      data.anh_dai_dien || null,
    ]
  );
  
  const createdBds = result.rows[0];

  // Nếu có ảnh, lưu vào bảng hinh_anh
  if (data.anh_dai_dien || (data.anh_phu && data.anh_phu.length > 0)) {
    const insertImagePromises = [];
    
    if (data.anh_dai_dien) {
      insertImagePromises.push(pool.query(
        `INSERT INTO hinh_anh (ma_bat_dong_san, duong_dan_anh, la_anh_chinh, ngay_tao) VALUES ($1, $2, true, NOW())`,
        [createdBds.ma_bat_dong_san, data.anh_dai_dien]
      ));
    }

    if (data.anh_phu && data.anh_phu.length > 0) {
      for (const url of data.anh_phu) {
        insertImagePromises.push(pool.query(
          `INSERT INTO hinh_anh (ma_bat_dong_san, duong_dan_anh, la_anh_chinh, ngay_tao) VALUES ($1, $2, false, NOW())`,
          [createdBds.ma_bat_dong_san, url]
        ));
      }
    }

    await Promise.all(insertImagePromises);
  }

  return createdBds;
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
  
  if (data.dien_tich !== undefined) { fields.push(`dien_tich = $${idx++}::NUMERIC`); values.push(data.dien_tich); }
  if (data.gia_thue !== undefined) { fields.push(`gia_thue = $${idx++}::NUMERIC`); values.push(data.gia_thue); }
  if (data.tien_dat_coc !== undefined) { fields.push(`tien_dat_coc = $${idx++}::NUMERIC`); values.push(data.tien_dat_coc); }
  if (data.trang_thai) { fields.push(`trang_thai = $${idx++}`); values.push(data.trang_thai); }
  if (data.tien_nghi !== undefined) { 
    fields.push(`tien_nghi = $${idx++}`); 
    values.push(data.tien_nghi ? (typeof data.tien_nghi === 'string' ? data.tien_nghi : JSON.stringify(data.tien_nghi)) : null); 
  }
  if (data.so_phong_ngu !== undefined) { fields.push(`so_phong_ngu = $${idx++}`); values.push(data.so_phong_ngu); }
  if (data.so_nguoi_toi_da !== undefined) { fields.push(`so_nguoi_toi_da = $${idx++}`); values.push(data.so_nguoi_toi_da); }

  if (data.vi_do !== undefined) { fields.push(`vi_do = $${idx++}`); values.push(data.vi_do); }
  if (data.kinh_do !== undefined) { fields.push(`kinh_do = $${idx++}`); values.push(data.kinh_do); }
  if (data.anh_dai_dien !== undefined) { fields.push(`anh_dai_dien = $${idx++}`); values.push(data.anh_dai_dien); }

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
