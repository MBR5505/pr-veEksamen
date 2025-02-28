import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import createJWT from "../utils/jwt.token.js";
import createCookie from "../utils/cookie.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const saltRounds = parseInt(process.env.SALT);

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
  
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (isPasswordCorrect) {
      const jwtToken = await createJWT(email);
      createCookie(res, jwtToken);
      return res.status(200).send({ 
        msg: "Login successful", 
        userId: user._id 
      });
    } else {
      res.status(401).send({ msg: "Incorrect password" });
    }
  },

  register: async (req, res) => {
    try {
      const { email, password, confirmPassword, kontaktSpråk } = req.body;

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const hash = await bcrypt.hash(password, saltRounds);
      const user = new User({
        email,
        password: hash,
        kontaktSpråk,
        uuid: uuidv4()
      });

      await user.save();
      const jwtToken = await createJWT(email);
      createCookie(res, jwtToken);

      res.status(201).send({ msg: "User created", userId: user._id });
    } catch (err) {
      console.error(err);
      res.status(500).send({ msg: "Error creating user" });
    }
  },

  user: async (req, res) => {
    try {
      // If you want to view a specific user (could be yourself or another user)
      const requestedUserId = req.params.id;
      
      // Check authorization (if viewing other users)
      if (requestedUserId !== req.user.id) {
        // Check if user has permission to view other users
        const currentUser = await User.findById(req.user.id).select('role');
        if (!currentUser || currentUser.role !== 'admin') {
          return res.status(403).send({ success: false, message: "Forbidden" });
        }
      }
      
      // Fetch the requested user
      const user = await User.findById(requestedUserId)
        .select('name email profileImage bio createdAt lastActive role');
      
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
      
      // If you need the user's flokker data, fetch it separately
      const flokker = await Flokk.find({ eier_id: requestedUserId })
        .select('name description status createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      
      // Combine the data for response
      res.status(200).send({
        success: true,
        data: {
          user: user.toObject(), // Convert to plain object
          flokker
        }
      });
    } catch (error) {
      console.error(`Error fetching user: ${error.message}`);
      
      if (error.name === 'CastError') {
        return res.status(400).send({ success: false, message: "Invalid user ID format" });
      }
      
      res.status(500).send({
        success: false,
        message: "Failed to retrieve user profile",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  logout: async (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).send({ msg: "Logged out successfully" });
    } catch (error) {
      res.status(500).send({ msg: "Error logging out" });
    }
  }
};

export default authController;