import express from "express";
import isAuth from "../middleware/isAuth.js";
import {createCreditSession} from "../controllers/creditsController.js";

const creditRouter = express.Router();

creditRouter.post("/order", isAuth, createCreditSession);

export default creditRouter;