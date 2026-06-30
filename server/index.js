import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './utils/connectDB.js';
import authRouter from './routes/authRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import notesRouter from './routes/generateRoute.js';
import pdfRouter from './routes/pdfRoute.js';
import creditRouter from './routes/creditRoute.js'; 
import { stripeWebhook } from './controllers/creditsController.js'; 

const app = express();

// 1. CORS MUST GO FIRST
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// 2. RAW WEBHOOK MIDDLEWARE (Must be placed BEFORE express.json())
app.post(
    "/api/credit/webhook",
    express.raw({ type: "application/json" }), 
    stripeWebhook
);

// 3. GENERAL PARSERS
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.json({message: 'ExamNotes AI Backend is running'})
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/credit", creditRouter); // Maps to /api/credit/order

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});