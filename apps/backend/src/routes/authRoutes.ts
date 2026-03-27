import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// POST /api/auth/register - Đăng ký tài khoản mới
router.post("/register", register);

// POST /api/auth/login - Đăng nhập
router.post("/login", login);

// GET /api/auth/me - Xem thông tin bản thân (yêu cầu đăng nhập)
router.get("/me", verifyToken, getMe);

export default router;
