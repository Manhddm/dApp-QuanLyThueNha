import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/authService";
import { findUserById } from "../models/userModel";
import { AuthRequest } from "../middlewares/authMiddleware";

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ho_ten, email, mat_khau, so_dien_thoai, vai_tro, dia_chi_vi } = req.body;

    // Validate cơ bản
    if (!ho_ten || !email || !mat_khau) {
      res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ họ tên, email và mật khẩu" });
      return;
    }

    const user = await registerUser({ ho_ten, email, mat_khau, so_dien_thoai, vai_tro, dia_chi_vi });

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
      res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu" });
      return;
    }

    const result = await loginUser(email, mat_khau);

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me - Lấy thông tin bản thân (cần token)
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.ma_nguoi_dung;
    if (!userId) {
      res.status(401).json({ success: false, message: "Chưa xác thực" });
      return;
    }

    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
      return;
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
