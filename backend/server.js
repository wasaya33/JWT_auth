import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import CONFIG, { validateConfig } from './CONFIG.js';
import userAuth from './middleware/userAuth.js';
import userRouter from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 4000;

// connect database
connectDB();

// Allowed origins for development
const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// routes
app.get('/', (req, res) => res.send('API working'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// ✅ Serve frontend build in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
}

// ✅ Validate configuration before starting the server
try {
  validateConfig(CONFIG);
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
} catch (error) {
  console.error('Configuration validation error:', error.message);
  process.exit(1);
}
