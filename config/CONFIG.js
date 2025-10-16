import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

const CONFIG = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase',
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
};

export function validateConfig(config) {
  const requiredKeys = ['JWT_SECRET', 'SMTP_USER', 'SMTP_PASS', 'SENDER_EMAIL'];
  const missingKeys = requiredKeys.filter(key => !config[key]);
  if (missingKeys.length) {
    throw new Error(`Missing required config keys: ${missingKeys.join(', ')}`);
  }
  return true;
}

export default CONFIG;
