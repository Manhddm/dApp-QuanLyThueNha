import { Request, Response, NextFunction } from "express";
import { getListBatDongSanService, getBatDongSanDetailService, createBatDongSanService, updateBatDongSanService, deleteBatDongSanService } from "../services/batDongSanService";
import { AuthRequest } from "../middlewares/authMiddleware";

// Lấy danh sách BĐS
export const getAllBatDongSan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const parseNum = (val: any) => {
      const n = parseFloat(val);
      return !isNaN(n) ? n : undefined;
    };

    const filters = {
      search: req.query.search as string,
      min_price: parseNum(req.query.min_price),
      max_price: parseNum(req.query.max_price),
      trang_thai: req.query.trang_thai as string,
      so_phong_ngu: parseNum(req.query.so_phong_ngu),
      tien_nghi: (req.query.tien_nghi as string)?.split(',').filter(Boolean),
      ma_chu_so_huu: parseNum(req.query.ma_chu_so_huu),
    };

    const { data, total } = await getListBatDongSanService(limit, offset, filters);
    res.json({ success: true, data, total });
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
      dien_tich, gia_thue, tien_dat_coc, trang_thai, tien_nghi, so_phong_ngu, so_nguoi_toi_da,
      vi_do, kinh_do, anh_dai_dien, anh_phu 
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
      dien_tich: Number(dien_tich), 
      gia_thue: Number(gia_thue), 
      tien_dat_coc: Number(tien_dat_coc), 
      trang_thai, tien_nghi, 
      so_phong_ngu: Number(so_phong_ngu || 1),
      so_nguoi_toi_da: Number(so_nguoi_toi_da || 2),
      vi_do: vi_do ? Number(vi_do) : undefined, 
      kinh_do: kinh_do ? Number(kinh_do) : undefined,
      anh_dai_dien,
      anh_phu
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

    const updateData = { ...req.body };
    if (updateData.dien_tich) updateData.dien_tich = Number(updateData.dien_tich);
    if (updateData.gia_thue) updateData.gia_thue = Number(updateData.gia_thue);
    if (updateData.tien_dat_coc) updateData.tien_dat_coc = Number(updateData.tien_dat_coc);
    if (updateData.so_phong_ngu) updateData.so_phong_ngu = Number(updateData.so_phong_ngu);
    if (updateData.so_nguoi_toi_da) updateData.so_nguoi_toi_da = Number(updateData.so_nguoi_toi_da);

    const updatedBds = await updateBatDongSanService(id, updateData, userId, role);
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
