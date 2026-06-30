import Usermodel from "../models/usermodel.js";
import { generateGeminiResponse } from "../services/geminiServices.js"
import { buildPrompt } from "../utils/promptBuilder.js"
import NotesModel from "../models/notesmodel.js"


export const generateNotes = async (req, res) => {
    try {
        const { topic, classLevel, examType, revisionMode = false, includeDiagram = false, includeChart = false } = req.body;
        
        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }

        // 1. Check if auth middleware actually passed the userId
        if (!req.userId) {
            return res.status(401).json({ error: "Unauthorized: Missing user identity tokens." });
        }

        const user = await Usermodel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.credits < 10) { // Fix: Should be < 10, not <= 10 if deduction cost is 10
            user.isCreditAvailable = false;
            await user.save();
            return res.status(403).json({ error: "Insufficient credits. Please recharge to continue." });
        }

        const prompt = buildPrompt({ topic, classLevel, examType, revisionMode, includeDiagram, includeChart });
        
        // Call Gemini service
        const generatedData = await generateGeminiResponse(prompt);
        
        if (!generatedData) {
            return res.status(524).json({ error: "Gemini failed to output structural data." });
        }

        // 2. Create the document safely
        const notes = await NotesModel.create({
            user: user._id,
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart,
            content: generatedData // Ensure your NotesModel schema accepts an Object type for content
        });

        // 3. Update user profile properties safely
        user.credits -= 10;
        user.isCreditAvailable = user.credits > 10;

        if (!Array.isArray(user.notes)) {
            user.notes = [];
        }
        user.notes.push(notes._id);
        
        await user.save();

        return res.status(200).json({
            message: "Notes generated successfully",
            data: generatedData,
            notesId: notes._id,
            creditsLeft: user.credits,
        });

    } catch (error) {
        // This is what prints the absolute truth behind your 500 error
        console.error("CRITICAL EXCEPTION in generateNotes:", error);
        return res.status(500).json({ 
            error: "Internal Server Error", 
            details: error.message // Optional: Remove in production for security
        });
    }
};