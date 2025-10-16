import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { registerEmailTemplate } from '../emailTemplates/registerEmail.js';

// ============================
// REGISTER CONTROLLER
// ============================
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input fields
  if (!name || !email || !password) {
    return res.status(400).json({
      Success: false,
      message: "Please provide name, email, and password"
    });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        Success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL, 
      to : email,
      subject: 'Welcome to Our Platform',
      html:registerEmailTemplate(name, email) // Using the email template
    }
    try{
      
      await transporter.sendMail(mailOptions);
    }catch(err){
      console.log("Error sending email:", err);
      return res.status(500).json({
        Success: false,
        message: "User registered but failed to send welcome email"
      });
    }

    // Success response
    return res.status(201).json({
      Success: true,
      message: "User registered successfully",   
    });

  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: error.message
    });
  }
};

// ============================
// LOGIN CONTROLLER
// ============================
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({
      Success: false,
      message: "Please provide email and password"
    });
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        Success: false,
        message: "Invalid Email"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        Success: false,
        message: "Invalid Password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie with token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Success response
    return res.json({
      Success: true,
      message: "Login Successful",
      token
    });

  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: error.message
    });
  }
};

// ============================
// LOGOUT CONTROLLER
// ============================
export const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });

    return res.json({
      Success: true,
      message: "Logout Successful"
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: error.message
    });
  }
};


// user  verification OTP to user's Email
export const  sendVerifyOtp = async (req, res) => {
  try {
    const {userId} = req.body;
    const user = await userModel.findById(userId);
    if(user.isVerified){
      res.json({
        Success: false,
        message: "Account is already verified"
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL, 
      subject: 'Account Verification OTP',
      to : user.email,
      text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}. It is valid for 10 minutes.`
    }
    await transporter.sendMail(mailOptions);
    res.json({
      Success: true,
      message: "OTP sent to your email",
    });
  
  } catch (error) {
    res.status(500).json({
      Success: false,
      message: error.message
    });
  }
}


export const  verifyEmail = async (req, res) => {
  const {userId , otp} = req.body;
  if(!userId || !otp){
    return res.status(400).json({
      Success: false,
      message: "Please provide userId and otp"
    });
  }
}