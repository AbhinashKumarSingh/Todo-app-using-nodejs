const jwt=require("jsonwebtoken")
const {User} =require("../models/schema");
const authenticate=async(req,res,next)=>{
        try{
                const token=req.cookies.jwtt;
                //console.log(token)
               // console.log(process.env.SECRET_KEY)
                const verifyToken=await jwt.verify(token,process.env.SECRET_KEY);
                //console.log(verifyToken)
                const rootUser=await User.findOne({"_id":verifyToken.userLogin_id,"tokens.token":token});
                //console.log(rootUser)
                if(!rootUser){throw new Error("user not found")}

                req.token=token;
                req.rootUser=rootUser;
                req.userID=rootUser._id;
                //console.log(rootUser);

                next();
        }
        catch (err){
            //console.log("hy");
            res.send("user unauthorised")
            //console.log(err.message);
        }

}

module.exports =authenticate;