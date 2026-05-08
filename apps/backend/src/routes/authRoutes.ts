import { Router } from "express";
import { register, login, getMe, walletLogin } from "../controllers/authController";
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

export default router;
