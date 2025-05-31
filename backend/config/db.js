import mongoose from "mongoose";
export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://Ruchi250:Ruchi_12345@cluster0.phz5q66.mongodb.net/food-del').then(()=>console.log("DB connected"));
}