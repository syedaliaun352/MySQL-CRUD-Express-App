import express from 'express';
import { registerUser, getUsers, getUserById, deleteUser, updateUser, getProducts } from '../controllers/userController.mjs';
import { validateRegisterInput } from '../validations/userValidation.mjs';
import limiter from '../middlewares/ratelimit.mjs';

const router = express.Router();

router.post('/register', limiter, validateRegisterInput, registerUser);

router.route('/users')
    .get(limiter, getUsers);

router.route('/users/:id')
    .all(limiter)
    .get(getUserById)
    .delete(deleteUser)
    .put(updateUser);

router.route('/products')
    .get(limiter, getProducts);

export default router;