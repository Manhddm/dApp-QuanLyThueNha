import { Router } from "express";
import { register, login, getMe, walletLogin, updateProfile, getUserByWallet } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// POST /api/auth/register - Đăng ký tài khoản mới
router.post("/register", register);

// POST /api/auth/login - Đăng nhập
router.post("/login", login);

// POST /api/auth/wallet-login - Đăng nhập bằng ví
router.post("/wallet-login", walletLogin);

// GET /api/auth/me - Xem thông tin bản thân (yêu cầu đăng nhập)
router.get("/me", verifyToken, getMe);

// PUT /api/auth/profile - Cập nhật thông tin cá nhân
router.put("/profile", verifyToken, updateProfile);

// GET /api/auth/user/:wallet - Lấy thông tin public theo ví
router.get("/user/:wallet", verifyToken, getUserByWallet);

export default router;
