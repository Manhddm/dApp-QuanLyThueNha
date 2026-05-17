import pool from "../config/db";

async function fix() {
    try {
        await pool.query("ALTER TABLE bat_dong_san ADD COLUMN IF NOT EXISTS so_phong_ngu INT NOT NULL DEFAULT 1");
        console.log("Successfully added so_phong_ngu column.");
        process.exit(0);
    } catch (err) {
        console.error("Error adding column:", err);
        process.exit(1);
    }
}

fix();
