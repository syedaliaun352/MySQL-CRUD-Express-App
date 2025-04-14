import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandler.mjs';
import productRouter from './routes/productRouter.mjs';
import userRouter from './routes/userRouter.mjs';

dotenv.config();

const app = express();
const serverPort = process.env.SERVER_PORT || 3000;

app.use(cors()); // not needed in production
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter)

app.all('/*splat', async (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

app.listen(serverPort, () => {
  console.log(`Listening on port: ${serverPort}`);
});
