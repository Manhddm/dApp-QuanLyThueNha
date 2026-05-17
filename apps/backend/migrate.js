import pg from 'pg';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new pg.Pool({
  host: process.env.PG_HOST || "localhost",
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "",
  database: process.env.PG_DATABASE || "quanlythuenha",
});

async function run() {
  try {
    await pool.query(`ALTER TABLE bat_dong_san ADD COLUMN IF NOT EXISTS anh_dai_dien TEXT;`);
    console.log("Added anh_dai_dien column to bat_dong_san table successfully.");
  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    await pool.end();
  }
}

run();
