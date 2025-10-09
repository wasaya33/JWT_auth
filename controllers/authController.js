import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';



// register function
export const register =async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ Success: false,message : "Please provide name, email and password" });
    }

      try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ Success: false, message: "User already exists" });
        }
        
        const hashedPassword =await bcrypt.hash(password, 10);

      } catch (error) {
        res.json({ Success: false, message: error.message });
      }
}