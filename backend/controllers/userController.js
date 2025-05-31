import userModel from "../models/userModel.js";

import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import validator from "validator"


//function for login user
const loginUser=async(req,res)=>{
    //to login the user we need user id and pass from req body
    const {email,password}=req.body;
    try {
        //if any account available, the user account will be stored in user variable
        const user=await userModel.findOne({email})
//if we dont have any user
        if(!user){
            return res.json({success:false,message:"User doesn't exists"})
        }

//if we are getting user ,we will match user pass with stored password in database

const isMatch=await bcryptjs.compare(password,user.password);
//if not match
if(!isMatch){
    return res.json({success:false,message:"Invalid credentials"})

}
    //if password matches  we generate a token
    const token=createToken(user._id);
    res.json({success:true,token })


 } 
 catch (error) {
        console.log(error);
        res,json({success:false,message:"Error"})
    }

}
//(id) is self generated in monodb db
const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//function register user

const registerUser=async (req,res)=>{
const {name,password,email}=req.body;
try {
    //checking if user already exists
    const exists=await userModel.findOne({email});
    if(exists){
        return res.json({success:false,message:"user already exists"})
    }
    //validating email format and strong password
    if(!validator.isEmail(email)){
        //if not valid return this response
        return res.json({success:false,message:"Please enter valid email"})
    }
//check password length
    if(password.lenght<8){
        //if not , return a response
        return res.json({success:false,message:"Please enter strong password"})
    }

    //to encrypt the package we will use bycrypt package
    //hashing user password
    const salt=await bcryptjs.genSalt(10)
    const hashedPassword=await bcryptjs.hash(password,salt)


    const newUser=new userModel({
        name:name,
        email:email,
        password:hashedPassword,
    })

    //user will be saved in db
    const user=await newUser.save()
    const token=createToken(user._id)
    res.json({success:true,token});

} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
}
}


export {loginUser,registerUser}