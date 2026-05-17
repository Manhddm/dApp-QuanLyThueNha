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

// POST /api/auth/wallet-login
export const walletLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dia_chi_vi } = req.body;

    if (!dia_chi_vi) {
      res.status(400).json({ success: false, message: "Thiếu địa chỉ ví" });
      return;
    }

    const { findUserByWallet } = require("../models/userModel");
    const jwt = require("jsonwebtoken");

    const user = await findUserByWallet(dia_chi_vi);
    if (!user) {
      res.status(404).json({ success: false, message: "Địa chỉ ví này chưa được đăng ký trong hệ thống" });
      return;
    }

    const token = jwt.sign(
      { ma_nguoi_dung: user.ma_nguoi_dung, email: user.email, vai_tro: user.vai_tro },
      process.env.JWT_SECRET || "bi_mat_vinh_cuu",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Đăng nhập bằng ví thành công",
      data: { token, user },
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

// PUT /api/auth/profile - Cập nhật thông tin cá nhân
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.ma_nguoi_dung;
    if (!userId) {
      res.status(401).json({ success: false, message: "Chưa xác thực" });
      return;
    }

    const { ho_ten, so_dien_thoai, so_cccd, anh_dai_dien, dia_chi_vi } = req.body;
    
    const { updateUser } = require("../models/userModel");
    const updatedUser = await updateUser(userId, { ho_ten, so_dien_thoai, so_cccd, anh_dai_dien, dia_chi_vi });

    if (!updatedUser) {
      res.status(400).json({ success: false, message: "Không thể cập nhật thông tin" });
      return;
    }

    res.json({ success: true, message: "Cập nhật thành công", data: updatedUser });
  } catch (err: any) {
    if (err.code === '23505') {
      if (err.constraint === 'nguoi_dung_dia_chi_vi_key') {
        res.status(400).json({ success: false, message: "Địa chỉ ví Blockchain này đã được liên kết với một tài khoản khác. Vui lòng chuyển sang ví khác!" });
      } else if (err.constraint === 'nguoi_dung_so_cccd_key') {
        res.status(400).json({ success: false, message: "Số CCCD này đã được đăng ký bởi tài khoản khác." });
      } else if (err.constraint === 'nguoi_dung_email_key') {
        res.status(400).json({ success: false, message: "Email này đã được đăng ký bởi tài khoản khác." });
      } else {
        res.status(400).json({ success: false, message: "Thông tin này đã tồn tại trong hệ thống." });
      }
      return;
    }
    next(err);
  }
};

// GET /api/auth/user/:wallet - Lấy thông tin công khai theo ví
export const getUserByWallet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { wallet } = req.params;
    if (!wallet) {
      res.status(400).json({ success: false, message: "Thiếu địa chỉ ví" });
      return;
    }

    const { findUserByWallet } = require("../models/userModel");
    const user = await findUserByWallet(wallet);

    if (!user) {
      res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
      return;
    }

    // Chỉ trả về các thông tin cần thiết cho hợp đồng
    const publicProfile = {
      ma_nguoi_dung: user.ma_nguoi_dung,
      ho_ten: user.ho_ten,
      so_dien_thoai: user.so_dien_thoai,
      so_cccd: user.so_cccd,
      dia_chi_vi: user.dia_chi_vi,
      email: user.email
    };

    res.json({ success: true, data: publicProfile });
  } catch (err) {
    next(err);
  }
};
