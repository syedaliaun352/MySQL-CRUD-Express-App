import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.mjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await pool.getConnection();
    console.log("Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1)
  }
})();

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.get("/api/users", async (req, res) => {
  try {
    const sql = 'SELECT * FROM users';
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.sendStatus(500);
  }
});

app.get('/api/users/:id', async (req, res) => {
  const userid = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.sendStatus(400);
  }

  const sql = 'SELECT * FROM users WHERE id = ?';
  try {
    const [results] = await pool.query(sql, [userid]);

    if (results.length === 0) {
      return res.sendStatus(404);
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
