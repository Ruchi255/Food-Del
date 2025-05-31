import jwt from "jsonwebtoken"
//middleware takes token,converts to userId,using userid we can add, remove or get data from cart
const authMiddleware=async(req,resizeBy,next)=>{
//first take token from users using headers
 const{token}=req.headers;

//if token is not avaiable?
if(!token){
    return res.json({success:false,message:"Not authorised Login again"})
}
//then destructure/decode the token from  req.header  by trycatch block
try {
    const token_decode=jwt.verify(token,process.env.JWT_SECRET);
    //in userController, we generated token, it has obeject with id,when we decode it we will get that id
    req.body.userId=token_decode.id;
    next();
} catch (error) {

    console.log(error);
    res.json({success:false,message:"Error"})
    
    
}
}

//connect it with cartRoute
export default authMiddleware;