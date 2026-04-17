import { Router } from "express";
import { getNonce, walletLogin, getMe } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// POST /api/auth/nonce — message để ký bằng ví
router.post("/nonce", getNonce);

// POST /api/auth/wallet — xác thực chữ ký, trả JWT (tự tạo tài khoản nếu ví chưa có trong DB)
router.post("/wallet", walletLogin);

// GET /api/auth/me - Thông tin bản thân (Bearer token)
router.get("/me", verifyToken, getMe);

export default router;
