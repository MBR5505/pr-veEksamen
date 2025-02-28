import express from "express";
import authController from "../controllers/auth.controller.js";
import verifyJWT from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/user", verifyJWT, authController.user);
router.post("/logout", verifyJWT, authController.logout);
router.get("/users/:id", verifyJWT, authController.user);
export default router;
