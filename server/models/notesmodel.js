import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        // Match the exact string name used in your user model ('Usermodel')
        ref: "Usermodel", 
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    classLevel: String, // Fixed the typo here from classLeve
    examType: String,
    revisionMode:{
        type: Boolean,
        default: false
    },
    includeDiagram: Boolean,
    includeChart: Boolean,
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
},{ timestamps: true })

// FIX: Check if the model already exists in mongoose.models before creating it
const NotesModel = mongoose.models.NotesModel || mongoose.model("NotesModel", notesSchema);

export default NotesModel;