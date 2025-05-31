import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"
//create variable,stripe is a package here
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)




//placing user order from frontend

const placeOrder=async(req,res)=>{

    const frontend_url="http://localhost:5175";



try {
    //add new order
    const newOrder=new orderModel({
        //middleware decodes token, there we get userId
        userId:req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address

    })
//it saves order in our db
    await newOrder.save();
    //when user places order we have to clear userCart
    await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

    //add logic to create payment link using stripe

    const line_items=req.body.items.map((item)=>({
   price_data:{
    currency:"AUD",
    product_data:{
        name:item.name
    },
    unit_amount:item.price*100*51
   },
   quantity:item.quantity
    }))

    //push delivery charges
 line_items.push({
    price_data:{
        currency:"AUD",
        product_data:{
            name:"Delivery Charges"
        },
        unit_amount:2*100*51
    },
    quantity:1
 })
//create one sesssion
 const session =await stripe.checkout.sessions.create({
    line_items:line_items,
    mode:'payment',
    success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
 })

 res.json({success:true,session_url:session.url})

} catch (error) {

    console.log(error);
    res.json({success:false,message:"Error"})
    
}
}
//lets use a temporary payment verification system

const verifyOrder=async(req,res)=>{
  //logic to verify orderPayment
  const {orderId,success}=req.body;
  try {
    if(success=="true"){
       await orderModel.findByIdAndUpdate(orderId,{payment:true});
       res.json({success:true,message:"Paid"})

    }
    else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false,message:"Not Paid"})
    }
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}
//user orders for frontend
const userOrders=async (req,res)=>{
try {
    const orders=await orderModel.find({userId:req.body.userId});
    res.json({success:true,data:orders})
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
}

}


//Listing orders for admin panel

const listOrders=async(req,res)=>{
try {
    const orders=await orderModel.find({});
        res.json({success:true,data:orders})
    
    
} catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
}
}
const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}



export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}
