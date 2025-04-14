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
      'INSERT INTO users (username, email, password, age, gender) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashPassword, age, gender]
    );

    res.status(201).json({
      message: 'User registered successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const [user] = await pool.query(
      'SELECT id, username, email, age, gender FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, email, plainpassword, age, gender } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
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
      password: existing[0].password,
      age: age ?? existing[0].age,
      gender: gender ?? existing[0].gender
    };
    if (plainpassword) {
      updateData.password = await bcrypt.hash(plainpassword, 10);
    }
    const [result] = await pool.query(
      `UPDATE users SET
        username = ?,
        email = ?,
        password = ?,
        age = ?,
        gender = ?
       WHERE id = ?`,
      [
        updateData.username,
        updateData.email,
        updateData.password,
        updateData.age,
        updateData.gender,
        userId
      ]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products'
    );
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};