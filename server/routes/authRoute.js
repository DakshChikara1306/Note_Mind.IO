import express from "express";
import { googleAuth } from "../controllers/authController.js";
import { logout } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/google", googleAuth);
authRouter.get("/logout", logout);

export default authRouter;