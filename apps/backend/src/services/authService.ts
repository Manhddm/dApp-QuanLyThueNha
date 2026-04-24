import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/userModel";
import { createError } from "../middlewares/errorHandler";

const SALT_ROUNDS = 12;

// Đăng ký người dùng mới
export const registerUser = async (data: {
  ho_ten: string;
  email: string;
  mat_khau: string;
  so_dien_thoai?: string;
  dia_chi_vi?: string;
  vai_tro?: string;
}) => {
  // Kiểm tra email đã tồn tại chưa
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw createError("Email đã được sử dụng", 409);
  }

  // Hash mật khẩu
  const mat_khau_hash = await bcrypt.hash(data.mat_khau, SALT_ROUNDS);

  // Tạo user trong DB
  const user = await createUser({
    ho_ten: data.ho_ten,
    email: data.email,
    mat_khau_hash,
    so_dien_thoai: data.so_dien_thoai,
    dia_chi_vi: data.dia_chi_vi,
    vai_tro: data.vai_tro || "nguoi_thue",
  });

  return user;
};

// Đăng nhập và trả về JWT
export const loginUser = async (email: string, mat_khau: string) => {
  // Tìm user theo email
  const user = await findUserByEmail(email);
  if (!user) {
    throw createError("Email hoặc mật khẩu không đúng", 401);
  }

  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(mat_khau, user.mat_khau_hash);
  if (!isMatch) {
    throw createError("Email hoặc mật khẩu không đúng", 401);
  }

  // Sinh JWT
  const secret = process.env.JWT_SECRET;
  if (!secret) throw createError("Lỗi cấu hình JWT_SECRET", 500);

  const token = jwt.sign(
    {
      ma_nguoi_dung: user.ma_nguoi_dung,
      email: user.email,
      vai_tro: user.vai_tro,
    },
    secret,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      ma_nguoi_dung: user.ma_nguoi_dung,
      ho_ten: user.ho_ten,
      email: user.email,
      vai_tro: user.vai_tro,
      da_xac_thuc: user.da_xac_thuc,
    },
  };
};
