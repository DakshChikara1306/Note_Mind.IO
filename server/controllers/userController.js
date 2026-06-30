import UserModel from "../models/UserModel.js";

export const getCurrentUser = async(req, res) => {
    try{

        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({user});

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
}