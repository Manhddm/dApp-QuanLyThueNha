import pool from "../config/db";

async function check() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'bat_dong_san'");
        console.log("Columns in bat_dong_san:");
        res.rows.forEach(row => console.log(`- ${row.column_name}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
