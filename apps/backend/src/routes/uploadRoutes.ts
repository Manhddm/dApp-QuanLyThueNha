import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// Endpoint to upload multiple images
router.post('/', upload.array('images', 10), (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: "Không có file nào được tải lên" });
        }

        // Tạo mảng URL trả về
        const urls = files.map(file => {
            // Giả định backend chạy trên port 3000
            return `http://localhost:3000/uploads/${file.filename}`;
        });

        res.status(200).json({
            success: true,
            message: "Tải lên thành công",
            urls: urls
        });
    } catch (error) {
        console.error("Lỗi upload:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ khi tải lên" });
    }
});

export default router;
