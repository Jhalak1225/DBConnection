import express from 'express';
import { json } from 'body-parser';
import authRoutes from './routes/auth';
import errorHandler from './middlewares/errorHandler';
import dotenv from 'dotenv';
import dbConnect from './utils/dbConnect';

dotenv.config();
dbConnect();
const app = express();
app.use(json());

app.use('/api', authRoutes);
app.get('/', (req, res) => {
  res.send('✅ Auth App is Running');
});

app.get('/sync-error', () => { throw new Error('Synchronous error!'); });

app.get('/async-error', async (req, res, next) => {
  try {
    throw new Error('Asynchronous error!');
  } catch (err) {
    next(err);
  }
});

app.get('/manual-error', (req, res, next) => {
  const error = new Error('Manual error forwarding');
  next(error);
});

app.use(errorHandler);

app.listen(3000, () => console.log('Server running on port 3000'));