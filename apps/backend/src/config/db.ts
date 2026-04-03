import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

// Đọc file .env từ thư mục gốc dự án
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

// Pool kết nối PostgreSQL - được dùng chung toàn ứng dụng
const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "",
  database: process.env.PG_DATABASE || "quanlythuenha",
});

// Kiểm tra kết nối khi khởi động
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Lỗi kết nối PostgreSQL:", err.message);
    return;
  }
  console.log("✅ Kết nối PostgreSQL thành công!");
  release();
});

export default pool;
