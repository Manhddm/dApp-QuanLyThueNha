import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (_req, res) => {
  let dbStatus = "not checked";

  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "quanlythuenha",
    });

    await connection.ping();
    dbStatus = "connected";
    await connection.end();
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
