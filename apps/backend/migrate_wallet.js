const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'quanlythuenha',
  password: 'Hieuls@2005',
  port: 5432,
});

async function migrate() {
  try {
    await pool.query('ALTER TABLE bat_dong_san ADD COLUMN IF NOT EXISTS vi_chu_nha VARCHAR(255);');
    console.log('Successfully added vi_chu_nha column');
  } catch (err) {
    console.error('Error migrating database:', err);
  } finally {
    await pool.end();
  }
}

migrate();
