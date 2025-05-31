import mongoose from "mongoose"
//create schema for order
const orderSchema=new mongoose.Schema({
    userId:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Food Processing"},
    date:{type:Date,default:Date.now()}, //whenever we place an order this date will be stored using current date
    payment:{type:Boolean,default:false}
})

//using Schema create orderModel

const orderModel=mongoose.models.order||mongoose.model("order",orderSchema);

//import this in orderController.js
export default orderModel;