import { response } from "express";
import userModel from "../models/userModel.js"

//create three arrow function
//add items to user cart

const addToCart=async(req,res)=>{
try {
    //find userdata, add condition in findone
    // let userData=await userModel.findOne({_id:req.body.userId})//userid should be same as req.body.userid, that we get from middleware
    let userData=await userModel.findById(req.body.userId);// or use this
    let cartData=await userData.cartData||{}; //extract cartdata,users cartdata will be stored in this variable
if(!cartData[req.body.itemId]){
    cartData[req.body.itemId]=1//if user want to add product to cart,and there is no entry in cart, it creates new entry

}
else{
    cartData[req.body.itemId]+=1; //when item is available,update item value
}
//when item added to cart,update users cart with new cart data
await userModel.findByIdAndUpdate(req.body.userId,{cartData});
res.json({success:true,message:"Added to cart"})
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
}
}

//remove items from userCart

const removeFromCart=async(req,res)=>{
try {
    let userData=await userModel.findById(req.body.userId)
    let cartData=await userData.cartData;//extract daata
    if(cartData[req.body.itemId]>0){//if item is available
        cartData[req.body.itemId]-=1;
    }
    await userModel.findByIdAndUpdate(req.body.userId,{cartData});
    res.json({success:true,message:"Removed from cart"})
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
}
}

//fetch user cart data

const getCart =async(req,res)=>{
try {
    let userData=await userModel.findById(req.body.userId)
    let cartData=await userData.cartData;
    res.json({success:true,cartData})
    
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
}
}

//import this in cartRoute of Router
export {addToCart,removeFromCart,getCart};