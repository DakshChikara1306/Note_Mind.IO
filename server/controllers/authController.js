import Usermodel from '../models/usermodel.js';
import { generateToken } from '../utils/token.js';

export const googleAuth = async (req, res) => {
    try{
        const {name, email} = req.body;
        let user = await Usermodel.findOne({ email });
        if(!user){
            user = await Usermodel.create({ name, email})
        }
        const token = await generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Set to true if using HTTPS
            sameSite: 'none', // Set to 'none' if using cross-site cookies 
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        return res.status(200).json({ message: 'User authenticated successfully', user, token });

    }catch (error) {
        console.error('Error in googleAuth:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (req, res) => {
  try {
    // 💥 FIX: Match the configuration options used during cookie creation
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    
    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error in logout:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}