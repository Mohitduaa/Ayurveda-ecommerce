import mongoose from "mongoose";
import UserModel from "../Models/User.Model.js";

const CartproductSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.ObjectId,
        ref:'Product'
    },
    quantity:{
        type:Number,
        default:1
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

const CartproductModel = mongoose.model("cartProduct",CartproductSchema)

export default CartproductModel; 