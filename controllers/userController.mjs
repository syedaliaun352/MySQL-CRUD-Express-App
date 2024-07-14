import pool from '../db.mjs';
import argon2 from 'argon2';

export const registerUser = async (req, res) => {
  const { username, email, plainpassword } = req.body;

  if (!username || !email || !plainpassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hash = await argon2.hash(plainpassword);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const [results] = await pool.query(sql, [username, email, hash]);

    if (results.affectedRows > 0) {
      res.json({ message: 'User Registered!' });
    } else {
      res.status(500).json({ message: 'Database error' });
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Username or email already exists' });
    } else {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const getUsers = async (req, res) => {
  try {
    const sql = 'SELECT * FROM users';
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.sendStatus(500);
  }
};

export const getUserById = async (req, res) => {
  const userid = parseInt(req.params.id);

  if (isNaN(userid)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const [results] = await pool.query(sql, [userid]);

    if (results.length === 0) {
      return res.sendStatus(404);
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  const userid = parseInt(req.params.id);

  if (isNaN(userid)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const sql = 'DELETE FROM users WHERE id = ?';
    const [results] = await pool.query(sql, [userid]);

    if (results.affectedRows === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found or database error' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req, res) => {
  const userid = parseInt(req.params.id);
  const { username, email, plainpassword } = req.body;

  if (isNaN(userid)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (!username || !email || !plainpassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const hash = await argon2.hash(plainpassword);
    const sql = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
    const [results] = await pool.query(sql, [username, email, hash, userid]);

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found or database error' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
