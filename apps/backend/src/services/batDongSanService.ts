import { BatDongSan, CreateBatDongSanDTO, UpdateBatDongSanDTO, getAllBatDongSan, getBatDongSanById, createBatDongSan, updateBatDongSan, deleteBatDongSan } from "../models/batDongSanModel";
import pool from "../config/db";

export const getListBatDongSanService = async (
  limit?: number, 
  offset?: number,
  filters?: { 
    search?: string; 
    min_price?: number; 
    max_price?: number; 
    trang_thai?: string; 
    so_phong_ngu?: number;
    tien_nghi?: string[];
    ma_chu_so_huu?: number;
  }
) => {
  return await getAllBatDongSan(limit, offset, filters);
};

export const getBatDongSanDetailService = async (id: number) => {
  const bds = await getBatDongSanById(id);
  if (!bds) throw new Error("Không tìm thấy bất động sản");
  return bds;
};

export const createBatDongSanService = async (data: CreateBatDongSanDTO, userId: number, role: string) => {
  if (role !== "chu_nha" && role !== "admin") {
    throw new Error("Chỉ chủ nhà hoặc admin mới có quyền tạo bất động sản");
  }

  // Gắn người dùng hiện tại là chủ sở hữu
  data.ma_chu_so_huu = userId;

  return await createBatDongSan(data);
};

export const updateBatDongSanService = async (id: number, data: UpdateBatDongSanDTO, userId: number, role: string) => {
  const bds = await getBatDongSanById(id);
  if (!bds) throw new Error("Không tìm thấy bất động sản");

  // Cho phép cập nhật trạng thái trống/đã thuê khi thực hiện thanh toán/trả phòng/thu cọc trên blockchain
  const isOnlyStatusUpdate = Object.keys(data).every(key => key === 'trang_thai');

  // Kiểm tra quyền (chỉ admin hoặc chủ sở hữu mới có quyền thay đổi thông tin hành chính/giá cả)
  if (role !== "admin" && bds.ma_chu_so_huu !== userId && !isOnlyStatusUpdate) {
    throw new Error("Bạn không có quyền cập nhật bất động sản này");
  }

  return await updateBatDongSan(id, data);
};

export const deleteBatDongSanService = async (id: number, userId: number, role: string) => {
  const bds = await getBatDongSanById(id);
  if (!bds) throw new Error("Không tìm thấy bất động sản");

  if (role !== "admin" && bds.ma_chu_so_huu !== userId) {
    throw new Error("Bạn không có quyền xóa bất động sản này");
  }

  // Kiểm tra xem có hợp đồng nào đang hiệu lực với BĐS này không
  const checkHopDong = await pool.query(
    "SELECT 1 FROM hop_dong WHERE ma_bat_dong_san = $1 AND trang_thai IN ('dang_hieu_luc', 'cho_duyet') LIMIT 1", 
    [id]
  );
  if ((checkHopDong.rowCount ?? 0) > 0) {
    throw new Error("Không thể xóa bất động sản đang có hợp đồng hoặc người thuê.");
  }

  const success = await deleteBatDongSan(id);
  if (!success) throw new Error("Xóa bất động sản thất bại");
  return true;
};
