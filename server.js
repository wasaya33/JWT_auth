import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import CONFIG, { validateConfig } from './config/CONFIG.js'; // ✅ import CONFIG too

const app = express();
const PORT = process.env.PORT || 4000;

// connect database
connectDB();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// routes
app.get('/', (req, res) => res.send('API working'));
app.use('/api/auth', authRouter);

// ✅ Validate configuration before starting the server
try {
  validateConfig(CONFIG); // ✅ pass CONFIG object
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
} catch (error) {
  console.error('Configuration validation error:', error.message);
  process.exit(1);
}
