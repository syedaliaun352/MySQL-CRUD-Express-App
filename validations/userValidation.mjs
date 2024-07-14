import { body } from 'express-validator';

export const validateRegisterInput = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('plainpassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];
