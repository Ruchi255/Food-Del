import express from "express"
import authMiddleware from "../middleware/auth.js"
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js"


//using express we will create router

const orderRouter=express.Router();

//using router we will create multiple end points

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userOrders",authMiddleware,userOrders);
orderRouter.get('/list',listOrders);
orderRouter.post("/status",updateStatus);


export default orderRouter;

