import { Request, Response, NextFunction } from "express";
import { getListBatDongSanService, getBatDongSanDetailService, createBatDongSanService, updateBatDongSanService, deleteBatDongSanService } from "../services/batDongSanService";
import { AuthRequest } from "../middlewares/authMiddleware";

// Lấy danh sách BĐS
export const getAllBatDongSan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const data = await getListBatDongSanService(limit, offset);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Lấy chi tiết BĐS
export const getBatDongSanById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID không hợp lệ" });

    const data = await getBatDongSanDetailService(id);
    res.json({ success: true, data });
  } catch (err: any) {
    if (err.message === "Không tìm thấy bất động sản") {
      res.status(404).json({ success: false, message: err.message });
      return;
    }
    next(err);
  }
};

// Tạo mới BĐS
export const createBatDongSan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { 
      ten, dia_chi, thanh_pho, quan_huyen, phuong_xa, mo_ta, loai_bat_dong_san,
      dien_tich, gia_thue, tien_dat_coc, trang_thai, tien_nghi, so_nguoi_toi_da,
      vi_do, kinh_do 
    } = req.body;
    
    if (!ten || !dia_chi || !thanh_pho || !quan_huyen) {
      res.status(400).json({ success: false, message: "Vui lòng nhập đủ Tên, Địa chỉ, Thành phố, Quận/Huyện" });
      return;
    }

    const userId = req.user?.ma_nguoi_dung;
    const role = req.user?.vai_tro;

    if (!userId || !role) {
      res.status(401).json({ success: false, message: "Chưa xác thực" });
      return;
    }

    const newBds = await createBatDongSanService({
      ma_chu_so_huu: userId,
      ten, dia_chi, thanh_pho, quan_huyen, phuong_xa, mo_ta, loai_bat_dong_san,
      dien_tich, gia_thue, tien_dat_coc, trang_thai, tien_nghi, so_nguoi_toi_da,
      vi_do, kinh_do
    }, userId, role);

    res.status(201).json({ success: true, message: "Tạo mới Bất động sản thành công", data: newBds });
  } catch (err: any) {
    if (err.message === "Chỉ chủ nhà hoặc admin mới có quyền tạo bất động sản") {
      res.status(403).json({ success: false, message: err.message });
      return;
    }
    next(err);
  }
};

// Cập nhật BĐS
export const updateBatDongSan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID không hợp lệ" });

    const userId = req.user?.ma_nguoi_dung;
    const role = req.user?.vai_tro;

    if (!userId || !role) {
      res.status(401).json({ success: false, message: "Chưa xác thực" });
      return;
    }

    const updatedBds = await updateBatDongSanService(id, req.body, userId, role);
    res.json({ success: true, message: "Cập nhật thành công", data: updatedBds });
  } catch (err: any) {
    if (err.message === "Không tìm thấy bất động sản") {
      res.status(404).json({ success: false, message: err.message });
      return;
    }
    if (err.message === "Bạn không có quyền cập nhật bất động sản này") {
      res.status(403).json({ success: false, message: err.message });
      return;
    }
    next(err);
  }
};

// Xóa BĐS
export const deleteBatDongSan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "ID không hợp lệ" });

    const userId = req.user?.ma_nguoi_dung;
    const role = req.user?.vai_tro;

    if (!userId || !role) {
      res.status(401).json({ success: false, message: "Chưa xác thực" });
      return;
    }

    await deleteBatDongSanService(id, userId, role);
    res.json({ success: true, message: "Xóa thành công" });
  } catch (err: any) {
    if (err.message === "Không tìm thấy bất động sản") {
      res.status(404).json({ success: false, message: err.message });
      return;
    }
    if (err.message === "Bạn không có quyền xóa bất động sản này") {
      res.status(403).json({ success: false, message: err.message });
      return;
    }
    if (err.message === "Không thể xóa bất động sản đang có hợp đồng hoặc người thuê.") {
      res.status(400).json({ success: false, message: err.message });
      return;
    }
    next(err);
  }
};
