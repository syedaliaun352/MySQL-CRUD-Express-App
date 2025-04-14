import express from 'express';
import { registerUser, getUsers, getUserById, deleteUser, updateUser } from '../controllers/userController.mjs';
import { validateRegisterInput } from '../validations/userValidation.mjs';
import limiter from '../middlewares/ratelimit.mjs';

const userRouter = express.Router();

userRouter.post('/register', limiter, validateRegisterInput, registerUser);

userRouter.route('/')
    .get(limiter, getUsers);

userRouter.route('/:id')
    .all(limiter)
    .get(getUserById)
    .delete(deleteUser)
    .put(updateUser);

export default userRouter;