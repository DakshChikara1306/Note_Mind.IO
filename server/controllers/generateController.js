import Usermodel from "../models/usermodel.js";
import { generateGeminiResponse } from "../services/geminiServices.js"
import { buildPrompt } from "../utils/promptBuilder.js"
import NotesModel from "../models/notesmodel.js"


export const generateNotes = async (req, res) => {
    try{
        const { topic, classLevel, examType, revisionMode = false, includeDiagram = false, includeChart = false } = req.body
        if (!topic) {
            return res.status(400).json({ error: "Topic is required" })
        }
        const user = await Usermodel.findById(req.userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        if (user.credits <= 10) {
            user.isCreditAvailable = false
            await user.save()
            return res.status(403).json({ error: "Insufficient credits. Please recharge to continue generating notes." })
        }
        const prompt = buildPrompt({ topic, classLevel, examType, revisionMode, includeDiagram, includeChart })
        const generatedData = await generateGeminiResponse(prompt)
        
        if (!generatedData) {
            return res.status(500).json({ error: "Failed to generate notes. Please try again later." })
        }
        const notes = await NotesModel.create({
            user: user._id,
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart,
            content: generatedData
        })
        user.credits -= 10
        if (user.credits <= 10) {
            user.isCreditAvailable = false      
        }
        if(!Array.isArray(user.notes)) {
            user.notes = []
        }
        user.notes.push(notes._id)
        await user.save()
        res.status(200).json(
            {
                message: "Notes generated successfully",
                data : generatedData,
                notesId: notes._id,
                creditsLeft: user.credits,
            }
        )

    }catch (error) {
        console.error("Error in generateNotes:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}