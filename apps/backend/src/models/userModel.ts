import pool from "../config/db";

export interface UpdateUserDTO {
  ho_ten?: string;
  so_dien_thoai?: string;
  anh_dai_dien?: string;
  dia_chi_vi?: string;
  dang_hoat_dong?: boolean;
  vai_tro?: "admin" | "chu_nha" | "nguoi_thue";
}

// Kiểu dữ liệu người dùng
export interface NguoiDung {
  ma_nguoi_dung: number;
  dia_chi_vi?: string;
  ho_ten: string;
  email: string;
  so_dien_thoai?: string;
  mat_khau_hash: string;
  so_cccd?: string;
  anh_dai_dien?: string;
  vai_tro: "admin" | "chu_nha" | "nguoi_thue";
  da_xac_thuc: boolean;
  dang_hoat_dong: boolean;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
}

// Tìm người dùng theo email
export const findUserByEmail = async (email: string): Promise<NguoiDung | null> => {
  const result = await pool.query<NguoiDung>(
    "SELECT * FROM nguoi_dung WHERE email = $1 AND dang_hoat_dong = true",
    [email]
  );
  return result.rows[0] || null;
};

// Tìm người dùng theo ID
export const findUserById = async (id: number): Promise<NguoiDung | null> => {
  const result = await pool.query<NguoiDung>(
    "SELECT ma_nguoi_dung, ho_ten, email, so_dien_thoai, vai_tro, da_xac_thuc, dang_hoat_dong, anh_dai_dien, ngay_tao FROM nguoi_dung WHERE ma_nguoi_dung = $1",
    [id]
  );
  return result.rows[0] || null;
};

// Tạo người dùng mới
export const createUser = async (data: {
  ho_ten: string;
  email: string;
  mat_khau_hash: string;
  so_dien_thoai?: string;
  dia_chi_vi?: string;
  vai_tro: string;
}): Promise<NguoiDung> => {
  const result = await pool.query<NguoiDung>(
    `INSERT INTO nguoi_dung (ho_ten, email, mat_khau_hash, so_dien_thoai, dia_chi_vi, vai_tro, da_xac_thuc, dang_hoat_dong, ngay_tao, ngay_cap_nhat)
     VALUES ($1, $2, $3, $4, $5, $6, false, true, NOW(), NOW())
     RETURNING ma_nguoi_dung, ho_ten, email, vai_tro, dia_chi_vi, da_xac_thuc`,
    [data.ho_ten, data.email, data.mat_khau_hash, data.so_dien_thoai || null, data.dia_chi_vi || null, data.vai_tro]
  );
  return result.rows[0];
};

// Cập nhật thông tin
export const updateUser = async (
  id: number,
  data: UpdateUserDTO
): Promise<NguoiDung | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.ho_ten) {
    fields.push(`ho_ten = $${idx++}`);
    values.push(data.ho_ten);
  }
  if (data.so_dien_thoai) {
    fields.push(`so_dien_thoai = $${idx++}`);
    values.push(data.so_dien_thoai);
  }
  if (data.anh_dai_dien) {
    fields.push(`anh_dai_dien = $${idx++}`);
    values.push(data.anh_dai_dien);
  }
  if (data.dia_chi_vi) {
    fields.push(`dia_chi_vi = $${idx++}`);
    values.push(data.dia_chi_vi);
  }
  if (data.vai_tro) {
    fields.push(`vai_tro = $${idx++}`);
    values.push(data.vai_tro);
  }
  if (data.dang_hoat_dong !== undefined) {
    fields.push(`dang_hoat_dong = $${idx++}`);
    values.push(data.dang_hoat_dong);
  }

  if (fields.length === 0) return null;

  fields.push(`ngay_cap_nhat = NOW()`);
  values.push(id);

  const result = await pool.query<NguoiDung>(
    `UPDATE nguoi_dung SET ${fields.join(", ")} WHERE ma_nguoi_dung = $${idx} RETURNING *`,
    values
  );
  return result.rows[0] || null;
};

// Lấy danh sách người dùng (có phân trang và lọc theo vai trò)
export const getAllUsers = async (
  limit: number = 20,
  offset: number = 0,
  vai_tro?: string
): Promise<NguoiDung[]> => {
  let query = `SELECT ma_nguoi_dung, ho_ten, email, so_dien_thoai, vai_tro, da_xac_thuc, dang_hoat_dong, anh_dai_dien, ngay_tao FROM nguoi_dung`;
  const values: any[] = [];
  let idx = 1;

  if (vai_tro) {
    query += ` WHERE vai_tro = $${idx++}`;
    values.push(vai_tro);
  }

  query += ` ORDER BY ngay_tao DESC LIMIT $${idx++} OFFSET $${idx++}`;
  values.push(limit, offset);

  const result = await pool.query<NguoiDung>(query, values);
  return result.rows;
};

// Xóa mềm người dùng
export const softDeleteUser = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    `UPDATE nguoi_dung SET dang_hoat_dong = false, ngay_cap_nhat = NOW() WHERE ma_nguoi_dung = $1 RETURNING ma_nguoi_dung`,
    [id]
  );
  return (result.rowCount ?? 0) > 0;
};
