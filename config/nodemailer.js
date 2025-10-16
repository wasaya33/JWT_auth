// config/nodemailer.js
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
import CONFIG from './CONFIG.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: CONFIG.SMTP_USER, // your gmail address
    pass: CONFIG.SMTP_PASS, // Gmail App Password
  },
});

transporter.verify()
  .then(() => console.log('Nodemailer transporter ready'))
  .catch(err => console.error('Nodemailer transporter error:', err));

export default transporter;
