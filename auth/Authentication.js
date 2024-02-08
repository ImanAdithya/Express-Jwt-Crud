const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');


dotenv.config();

module.exports=function (req,res,next) {
    let  authToken=req.get('authorization');
    if (authToken && authToken.startsWith('Bearer ')){
        authToken=authToken.slice(7);
        try {
            const decoded=jwt.verify(authToken,process.env.TOKEN_KEY);
            next();

        }catch (error){
            console.error("ERROR Verify token",error);
            return res.status(401).json({message:"UnAuth User"});
        }

    }else {
        return res.status(401).json({message:"UnAuth User"});
    }
}
