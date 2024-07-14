import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// for linux
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'database_name',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
//   });

(async () => {
    try {
      const connection = await pool.getConnection();
      console.log('Connected to MySQL database');
      connection.release();
    } catch (error) {
      console.error('Error connecting to MySQL database:', error);
      process.exit(1);
    }
  })();

export default pool;
