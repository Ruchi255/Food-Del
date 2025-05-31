import express from "express"
import authMiddleware from "../middleware/auth.js";

import { addToCart,removeFromCart,getCart } from "../controllers/cartController.js"

//create one express router
const cartRouter=express.Router();

//using that router we will create multiple end points
cartRouter.post("/add",authMiddleware,addToCart)
cartRouter.post("/remove",authMiddleware,removeFromCart)
cartRouter.post("/get",authMiddleware,getCart)


//initialize this file in server.js file
export default cartRouter;