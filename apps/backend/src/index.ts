import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Đọc file .env từ thư mục gốc (index.ts nằm ở src/)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Import routes
import authRoutes from "./routes/authRoutes";
import batDongSanRoutes from "./routes/batDongSanRoutes";
import userRoutes from "./routes/userRoutes";
import hopDongRoutes from "./routes/hopDongRoutes";
import uploadRoutes from "./routes/uploadRoutes";

// Import error handler (đặt cuối cùng)
import { errorHandler } from "./middlewares/errorHandler";

// Import db để kích hoạt kết nối khi khởi động
import "./config/db";

const app = express();

// ====== Middlewares toàn cục ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== Routes ======
app.use("/api/auth", authRoutes);
app.use("/api/bat-dong-san", batDongSanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hop-dong", hopDongRoutes);
app.use("/api/upload", uploadRoutes);

// Phục vụ các file tĩnh trong thư mục uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check
app.get("/", (_req, res) => {
  res.json({
    app: "QuanLyThueNha API",
    version: "1.0.0",
    status: "ok",
  });
});

// ====== Global Error Handler (phải đặt sau cùng) ======
app.use(errorHandler);

// ====== Khởi động server ======
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`🚀 Backend đang chạy tại http://localhost:${port}`);
});
