import express from 'express';
import { registerUser, getUsers, getUserById, deleteUser, updateUser } from '../controllers/userController.mjs';

const router = express.Router();

router.post('/register', registerUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

export default router;
