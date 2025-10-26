import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import CONFIG, { validateConfig } from './CONFIG.js';

import userAuth from './middleware/userAuth.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// connect database
connectDB();
const allowedOrigins = ['http://localhost:5173'];
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins , credentials: true }));

// routes
app.get('/', (req, res) => res.send('API working'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter );

// ✅ Validate configuration before starting the server
try {
  validateConfig(CONFIG); // ✅ pass CONFIG object
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
} catch (error) {
  console.error('Configuration validation error:', error.message);
  process.exit(1);
}
