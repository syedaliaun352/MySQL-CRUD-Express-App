import express from 'express';
import { registerUser, getUsers, getUserById, deleteUser, updateUser } from '../controllers/userController.mjs';
import { validateRegisterInput } from '../validations/userValidation.mjs';
import limiter from '../middlewares/ratelimit.mjs';

const router = express.Router();

router.post('/register',limiter, validateRegisterInput, registerUser);
router.get('/users',limiter, getUsers);
router.get('/users/:id',limiter, getUserById);
router.delete('/users/:id',limiter, deleteUser);
router.put('/users/:id', limiter, updateUser);

export default router;
