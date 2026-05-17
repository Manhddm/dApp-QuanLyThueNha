import { Router } from "express";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";
import * as hopDongController from "../controllers/hopDongController";

const router = Router();

// Khách thuê tạo hợp đồng (sau khi gọi blockchain thuePhong)
router.post("/", verifyToken, requireRole("nguoi_thue"), hopDongController.taoHopDong);

// Xem danh sách hợp đồng của tôi
router.get("/cua-toi", verifyToken, hopDongController.layHopDongCuaToi);

// Chủ nhà lấy danh sách chờ duyệt
router.get("/cho-duyet", verifyToken, requireRole("chu_nha"), hopDongController.layHopDongChoDuyet);

// Chủ nhà duyệt (sau khi gọi blockchain duyetThuePhong)
router.put("/:id/duyet", verifyToken, requireRole("chu_nha"), hopDongController.duyetHopDong);

// Chủ nhà từ chối (sau khi gọi blockchain tuChoiThuePhong)
router.put("/:id/tu-choi", verifyToken, requireRole("chu_nha"), hopDongController.tuChoiHopDong);

export default router;
