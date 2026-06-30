import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    try{
        let {token} = req.cookies;
        if(token){
            let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
            if(!verifyToken) return res.status(401).json({message: "Unauthorized"}); 
            req.userId = verifyToken.userId;
            next();
        }else{
            res.status(401).json({message: "Unauthorized"});
        }
    }catch(err){
        res.status(401).json({message: "Invalid token"});
    }
}

export default isAuth;