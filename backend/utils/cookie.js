import dotenv from "dotenv";
dotenv.config();

function createCookie(res, jwtToken) {
    res.cookie("jwt", jwtToken, {
        httpOnly: true,
        maxAge: 1000*60*60*24*5,
        secure: process.env.NODE_ENV === "production",
      });
};

export default createCookie;