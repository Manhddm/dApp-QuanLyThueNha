import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as hopDongModel from "../models/hopDongModel";
import * as batDongSanModel from "../models/batDongSanModel";
import { createError } from "../middlewares/errorHandler";

// POST /api/hop-dong
export const taoHopDong = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ma_nguoi_thue = req.user?.ma_nguoi_dung;
    if (!ma_nguoi_thue) throw createError("Chưa xác thực", 401);

    const { 
      ma_bat_dong_san, 
      ngay_bat_dau, 
      ngay_ket_thuc, 
      ma_giao_dich_blockchain 
    } = req.body;

    // Lấy thông tin bất động sản để điền tiền thuê và chủ nhà
    const bds = await batDongSanModel.findBatDongSanById(ma_bat_dong_san);
    if (!bds) throw createError("Không tìm thấy bất động sản", 404);

    const hopDong = await hopDongModel.createHopDong({
      ma_bat_dong_san,
      ma_nguoi_thue,
      ma_chu_nha: bds.ma_chu_so_huu,
      ngay_bat_dau: new Date(ngay_bat_dau),
      ngay_ket_thuc: new Date(ngay_ket_thuc),
      tien_thue_hang_thang: bds.gia_thue,
      tien_dat_coc: bds.tien_dat_coc,
      trang_thai: 'cho_duyet',
      ma_giao_dich_blockchain
    });

    res.status(201).json({
      success: true,
      message: "Gửi yêu cầu thuê nhà thành công",
      data: hopDong
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/hop-dong/cua-toi
export const layHopDongCuaToi = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.ma_nguoi_dung;
    const vaiTro = req.user?.vai_tro;
    if (!userId) throw createError("Chưa xác thực", 401);

    let hopDongs;
    if (vaiTro === 'chu_nha') {
      hopDongs = await hopDongModel.findHopDongByChuNha(userId);
    } else {
      hopDongs = await hopDongModel.findHopDongByNguoiThue(userId);
    }

    res.json({
      success: true,
      data: hopDongs
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/hop-dong/cho-duyet (Dành cho chủ nhà)
export const layHopDongChoDuyet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ma_chu_nha = req.user?.ma_nguoi_dung;
    if (!ma_chu_nha || req.user?.vai_tro !== 'chu_nha') {
      throw createError("Chỉ chủ nhà mới có quyền này", 403);
    }

    const hopDongs = await hopDongModel.findHopDongByChuNha(ma_chu_nha, 'cho_duyet');

    res.json({
      success: true,
      data: hopDongs
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/hop-dong/:id/duyet
export const duyetHopDong = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ma_chu_nha = req.user?.ma_nguoi_dung;
    const { id } = req.params;
    const { ma_giao_dich_blockchain } = req.body;

    const hopDong = await hopDongModel.findHopDongById(Number(id));
    if (!hopDong) throw createError("Không tìm thấy hợp đồng", 404);

    if (hopDong.ma_chu_nha !== ma_chu_nha) {
      throw createError("Bạn không phải chủ nhà của hợp đồng này", 403);
    }

    const updated = await hopDongModel.updateHopDongStatus(Number(id), 'dang_hieu_luc', ma_giao_dich_blockchain);

    // Cập nhật trạng thái bất động sản sang 'da_thue'
    await batDongSanModel.updateBatDongSan(hopDong.ma_bat_dong_san, { trang_thai: 'da_thue' });

    res.json({
      success: true,
      message: "Duyệt hợp đồng thành công",
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/hop-dong/:id/tu-choi
export const tuChoiHopDong = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ma_chu_nha = req.user?.ma_nguoi_dung;
    const { id } = req.params;
    const { ma_giao_dich_blockchain } = req.body;

    const hopDong = await hopDongModel.findHopDongById(Number(id));
    if (!hopDong) throw createError("Không tìm thấy hợp đồng", 404);

    if (hopDong.ma_chu_nha !== ma_chu_nha) {
      throw createError("Bạn không phải chủ nhà của hợp đồng này", 403);
    }

    const updated = await hopDongModel.updateHopDongStatus(Number(id), 'da_huy', ma_giao_dich_blockchain);

    res.json({
      success: true,
      message: "Từ chối hợp đồng thành công",
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
