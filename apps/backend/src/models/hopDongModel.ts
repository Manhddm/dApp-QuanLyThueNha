import db from "../config/db";

export interface HopDong {
  ma_hop_dong?: number;
  ma_bat_dong_san: number;
  ma_nguoi_thue: number;
  ma_chu_nha: number;
  ngay_bat_dau: Date;
  ngay_ket_thuc: Date;
  tien_thue_hang_thang: number;
  tien_dat_coc: number;
  ngay_thanh_toan_hang_thang?: number;
  dieu_khoan?: string;
  trang_thai?: string;
  ma_giao_dich_blockchain?: string;
  dia_chi_hop_dong_bc?: string;
  thoi_gian_ky?: Date;
  ngay_tao?: Date;
  ngay_cap_nhat?: Date;
}

export const createHopDong = async (data: Partial<HopDong>) => {
  const query = `
    INSERT INTO hop_dong (
      ma_bat_dong_san, ma_nguoi_thue, ma_chu_nha, 
      ngay_bat_dau, ngay_ket_thuc, 
      tien_thue_hang_thang, tien_dat_coc, 
      dieu_khoan, trang_thai, ma_giao_dich_blockchain
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [
    data.ma_bat_dong_san, data.ma_nguoi_thue, data.ma_chu_nha,
    data.ngay_bat_dau, data.ngay_ket_thuc,
    data.tien_thue_hang_thang, data.tien_dat_coc,
    data.dieu_khoan, data.trang_thai || 'cho_duyet', data.ma_giao_dich_blockchain
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const updateHopDongStatus = async (ma_hop_dong: number, trang_thai: string, ma_giao_dich_blockchain?: string) => {
  let query = `UPDATE hop_dong SET trang_thai = $1, ngay_cap_nhat = NOW()`;
  const values = [trang_thai];
  
  if (ma_giao_dich_blockchain) {
    query += `, ma_giao_dich_blockchain = $2`;
    values.push(ma_giao_dich_blockchain);
    query += ` WHERE ma_hop_dong = $3 RETURNING *;`;
    values.push(ma_hop_dong.toString());
  } else {
    query += ` WHERE ma_hop_dong = $2 RETURNING *;`;
    values.push(ma_hop_dong.toString());
  }
  
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const findHopDongByNguoiThue = async (ma_nguoi_thue: number) => {
  const query = `
    SELECT h.*, b.ten as ten_bat_dong_san, b.dia_chi
    FROM hop_dong h
    JOIN bat_dong_san b ON h.ma_bat_dong_san = b.ma_bat_dong_san
    WHERE h.ma_nguoi_thue = $1
    ORDER BY h.ngay_tao DESC;
  `;
  const { rows } = await db.query(query, [ma_nguoi_thue]);
  return rows;
};

export const findHopDongByChuNha = async (ma_chu_nha: number, trang_thai?: string) => {
  let query = `
    SELECT h.*, b.ten as ten_bat_dong_san, b.dia_chi, n.ho_ten as ten_nguoi_thue, n.dia_chi_vi as vi_nguoi_thue
    FROM hop_dong h
    JOIN bat_dong_san b ON h.ma_bat_dong_san = b.ma_bat_dong_san
    JOIN nguoi_dung n ON h.ma_nguoi_thue = n.ma_nguoi_dung
    WHERE h.ma_chu_nha = $1
  `;
  const values: any[] = [ma_chu_nha];
  
  if (trang_thai) {
    query += ` AND h.trang_thai = $2`;
    values.push(trang_thai);
  }
  
  query += ` ORDER BY h.ngay_tao DESC;`;
  
  const { rows } = await db.query(query, values);
  return rows;
};

export const findHopDongById = async (ma_hop_dong: number) => {
  const query = `SELECT * FROM hop_dong WHERE ma_hop_dong = $1`;
  const { rows } = await db.query(query, [ma_hop_dong]);
  return rows[0];
};
