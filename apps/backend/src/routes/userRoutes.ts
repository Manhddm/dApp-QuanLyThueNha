import { Router } from "express";
import { getUsers, getUser, getProfile, updateProfile, deleteUser, updateMyProfile } from "../controllers/userController";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";

const router = Router();

// Routes phục vụ cho mọi user đã login
// Lấy / Sửa profile cá nhân (phải đứng trước /:id để tránh conflict)
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateMyProfile);

// Routes yêu cầu quyền admin
router.get("/", verifyToken, requireRole("admin"), getUsers);
router.delete("/:id", verifyToken, requireRole("admin"), deleteUser);

// Routes để lấy/cập nhật thông tin chi tiết (tự do vì có check quyền trong service)
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateProfile);

export default router;
