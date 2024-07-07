import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.mjs';
import argon2 from 'argon2';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database");
    connection.release();

  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
})();


app.get("/api", (req, res) => {
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

  if (isNaN(userid)) {
    return res.sendStatus(400);
  }
  try {
    const sql = 'SELECT * FROM users WHERE id = ?';
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

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, plainpassword } = req.body;
    const hashpw = await argon2.hash(plainpassword);

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const [results] = await pool.query(sql, [username, email, hashpw]);
    if ([results]){
      res.json({ message: 'User Registered!' });
    }

  } catch (error) {
    console.error('Error registering user:', error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
