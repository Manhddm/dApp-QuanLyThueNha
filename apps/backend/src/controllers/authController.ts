import { Request, Response, NextFunction } from "express";
import { requestWalletNonce, loginWithWalletSignature } from "../services/authService";
import { findUserById } from "../models/userModel";
import { AuthRequest } from "../middlewares/authMiddleware";

// POST /api/auth/nonce — lấy message cần ký (Sign-In With Ethereum style)
export const getNonce = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.body;
    if (!address || typeof address !== "string") {
      res.status(400).json({ success: false, message: "Thiếu địa chỉ ví (address)" });
      return;
    }

    const { message, address: normalized } = await requestWalletNonce(address);

    res.json({
      success: true,
      data: { message, address: normalized },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/wallet — gửi chữ ký, nhận JWT
export const walletLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address, message, signature } = req.body;

    if (!address || !message || !signature) {
      res.status(400).json({
        success: false,
        message: "Cần address, message và signature",
      });
      return;
    }

    const result = await loginWithWalletSignature(address, message, signature);

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
