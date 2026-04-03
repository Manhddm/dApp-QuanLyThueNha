import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Mở rộng Request để thêm thông tin user
export interface AuthRequest extends Request {
  user?: {
    ma_nguoi_dung: number;
    vai_tro: string;
    email: string;
  };
}

// Middleware xác thực JWT
export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    res.status(401).json({ success: false, message: "Không có token xác thực" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ success: false, message: "Cấu hình JWT_SECRET bị thiếu" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware phân quyền theo vai trò
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Chưa xác thực" });
      return;
    }
    if (!roles.includes(req.user.vai_tro)) {
      res.status(403).json({ success: false, message: "Không có quyền truy cập" });
      return;
    }
    next();
  };
};
