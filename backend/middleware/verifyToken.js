import jwt from "jsonwebtoken";
import "dotenv/config.js";
import User from "../models/user.model.js";

async function verifyJWT(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).send({ msg: "User not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }

        req.user.id = user._id;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Authentication error" });
    }
}

export default verifyJWT;