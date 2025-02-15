import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    orderId:{
        type:String,
        required:[true,"Provide orderId"],
        unique:true
    },
    productId:{
        type:mongoose.Schema.ObjectId,
        ref:"Product"
    },
    product_details:{
        name:String,
        image:String
    },
    paymentId:{
        type:String,
        default:""
    },
    payment_status :{
        type:String,
        default:""
    },
    delivery_address :{
        type:mongoose.Schema.ObjectId,
        ref:"address"
    },
    subTotalAmt:{
        type:Number,
        default:0
    },
    totalAmt:{
        type:Number,
        default:0
    },
    invoice_receipt:{
        type:String,
        default:""
    }
},{
    timestamps:true
})

const OrderModel = mongoose.model("order",OrderSchema)

export default OrderModel;