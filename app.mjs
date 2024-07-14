import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.mjs';
import errorHandler from './middlewares/errorHandler.mjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // not needed in production
app.use(express.json());

app.use('/api', userRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
