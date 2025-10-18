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

  if (!name || !email || !password) {
    return res.status(400).json({
      Success: false,
      message: "Please provide name, email, and password",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        Success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Our Platform",
      html: registerEmailTemplate(name, email),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log("Error sending email:", err);
      return res.status(500).json({
        Success: false,
        message: "User registered but failed to send welcome email",
      });
    }

    return res.status(201).json({
      Success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: error.message,
    });
  }
};

// ============================
// LOGIN CONTROLLER
// ============================
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      Success: false,
      message: "Please provide email and password",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        Success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        Success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      Success: true,
      message: "Login Successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: error.message,
    });
  }
};

// ============================
// LOGOUT CONTROLLER
// ============================
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      Success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: error.message,
    });
  }
};

// ============================
// SEND VERIFY OTP
// ============================
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (user.isVerified) {
      return res.json({
        Success: false,
        message: "Account is already verified",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyOtp = otp;
    user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000; // ✅ 10 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      Success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    res.status(500).json({
      Success: false,
      message: error.message,
    });
  }
};

// ============================
// VERIFY EMAIL
// ============================
export const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        Success: false,
        message: "Please provide userId and otp",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        Success: false,
        message: "User not found",
      });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({
        Success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ fixed name — now checks the correct expiry field
    if (user.verifyOtpExpiry < Date.now()) {
      return res.status(400).json({
        Success: false,
        message: "OTP has expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiry = null;
    await user.save();

    return res.json({
      Success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: error.message,
    });
  }
};


// check if user is authenticated
export const isAuthenticated = (req, res) => {
  try {
    return res.json({
      Success: true,
      message: "User is authenticated",
      userId: req.body.userId
    });
  }catch (error) {
      return res.status(500).json({
        Success: false, 
        message: error.message
      });
    }}



    // send reset password otp
export const sendResetPasswordOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      Success: false,
      message: "Please provide email",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        Success: false,
        message: "User with this email does not exist",
      });
    }
     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; 
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({
      Success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: error.message,
    });
  }
}



// reset user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      Success: false,
      message: "Please provide email, otp and new password",
    });
  }
  try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          Success: false,
          message: "User with this email does not exist",
        });
      }
      if (user.resetOtp === "" || user.resetOtp !== otp   ) {
        return res.status(400).json({
          Success: false,
          message: "Invalid OTP",
        });
      }
      if (user.resetOtpExpireAt < Date.now()) {
        return res.status(400).json({
          Success: false,
          message: "OTP has expired",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;
      await user.save();
      return res.json({
        Success: true,
        message: "Password reset successfully",
      });
  } catch (error) {
    return res.status(500).json({
      Success: false,
      message: error.message,
    });
  }
};