import Notes from '../models/notesmodel.js';

export const getMyNotes = async (req, res) => {
    try{
        const notes = await Notes.find({ user: req.userId }).select("topic classLevel examType revisionMode includeDiagram includeChart createdAt").sort({ createdAt: -1 });
        if(!notes) return res.status(404).json({ success: false, message: "No notes found" });

        return res.status(200).json({ success: true, notes });

    }catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getSingleNote = async (req, res) => {
    try{
        const note = await Notes.findOne({ _id: req.params.id, user: req.userId })
        if(!note){
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        return res.status(200).json(
            {
                content: note.content,
                topic: note.topic,
                createdAt: note.createdAt,
            }
        );

    }catch(err){
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}