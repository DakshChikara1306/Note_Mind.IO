import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    credits:{
        type: Number,
        default: 50,
        min: 0
    },
    isCreditAvailable: {
        type: Boolean,
        default: true
    },
    notes:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'NotesModel',
        default: []
    }
},{timestamps: true})

// FIX: Check if the model exists in mongoose.models before creating a new one
const Usermodel = mongoose.models.Usermodel || mongoose.model('Usermodel', userSchema);

export default Usermodel;