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
      const user = await User.findOne({ _id: req.params.id })
        .populate('flokker');
      
      if (user) {
        res.status(200).send({ msg: "Loading Profile...", user });
      } else {
        res.status(404).send({ msg: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Server error" });
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