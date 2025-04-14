import pool from '../db.mjs';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  const { username, email, plainpassword, age = null, gender = null } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const hashPassword = await bcrypt.hash(plainpassword, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, age, gender) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashPassword, age, gender]
    );

    res.status(201).json({
      message: 'User registered successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500)
    throw new Error("Failed to register user");
  }
};

export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, age, gender FROM users'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500)
    throw new Error("Failed to fetch users");
  }
};

export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    res.status(400)
    throw new Error("Invalid user ID format");
  }

  try {
    const [user] = await pool.query(
      'SELECT id, username, email, age, gender FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      res.status(404)
      throw new Error("User not found");
    }

    res.json(user[0]);
  } catch (error) {
    console.error('Get user error:', error);
    throw new Error("Failed to fetch user");

  }
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, email, plainpassword, age, gender } = req.body;

  if (isNaN(userId)) {
    res.status(400)
    throw new Error("Invalid user ID format");
  }

  try {
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (existing.length === 0) {
      res.status(404)
      throw new Error("User not found");
    }

    if (username || email) {
      const [duplicate] = await pool.query(
        'SELECT id FROM users WHERE (username = ? OR email = ?) AND id <> ?',
        [username || existing[0].username, email || existing[0].email, userId]
      );

      if (duplicate.length > 0) {
        return res.status(409).json({ error: 'Username or email already in use' });
      }
    }

    const updateData = {
      username: username || existing[0].username,
      email: email || existing[0].email,
      password_hash: existing[0].password_hash,
      age: age ?? existing[0].age,
      gender: gender ?? existing[0].gender
    };
    if (plainpassword) {
      updateData.password_hash = await bcrypt.hash(plainpassword, 10);
    }
    const [result] = await pool.query(
      `UPDATE users SET
        username = ?,
        email = ?,
        password_hash = ?,
        age = ?,
        gender = ?
       WHERE id = ?`,
      [
        updateData.username,
        updateData.email,
        updateData.password_hash,
        updateData.age,
        updateData.gender,
        userId
      ]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500)
    throw new Error("Failed to update user");

  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    res.status(400)
    throw new Error("Invalid user ID format");
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      res.status(404)
      throw new Error("User not found");
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500)
    throw new Error("Failed to delete user");

  }
};