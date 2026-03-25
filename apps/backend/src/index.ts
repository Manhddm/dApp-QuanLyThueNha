import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Tạo connection pool cho PostgreSQL
const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: Number(process.env.PG_PORT || 5432),
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "",
  database: process.env.PG_DATABASE || "quanlythuenha",
});

app.get("/", async (_req, res) => {
  let dbStatus = "not checked";

  try {
    // Kiểm tra kết nối bằng cách chạy query đơn giản
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    dbStatus = "connected";
  } catch (_error) {
    dbStatus = "not connected";
  }

  res.json({
    app: "QuanLyThueNha backend",
    status: "ok",
    database: dbStatus,
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
