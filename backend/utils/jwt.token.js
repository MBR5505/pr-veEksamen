import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

async function createJWT(email, role) {
    const user = await User.findOne({ email });
    const jwtToken = jwt.sign(
        { email: email, role: "user", id: user._id },
        process.env.JWT_SECRET,
    );
    console.log(jwtToken);
    return jwtToken;
}

export default createJWT;