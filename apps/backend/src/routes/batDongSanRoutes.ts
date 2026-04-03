import { Router } from "express";
import { getAllBatDongSan, getBatDongSanById, createBatDongSan, updateBatDongSan, deleteBatDongSan } from "../controllers/batDongSanController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Lấy danh sách (Public)
router.get("/", getAllBatDongSan);

// Lấy chi tiết (Public)
router.get("/:id", getBatDongSanById);

// Tạo mới nhà (Chỉ Chủ nhà/Admin - Cần verify Token)
router.post("/", verifyToken, createBatDongSan);

// Cập nhật nhà (Cần xác thực Token và verify quyền chủ nhà)
router.put("/:id", verifyToken, updateBatDongSan);

// Xóa nhà (Cần xác thực Token và verify quyền chủ nhà)
router.delete("/:id", verifyToken, deleteBatDongSan);

export default router;
