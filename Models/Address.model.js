import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    address_line:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    state:{
        type:String,
        default:""
    },
    pincode :{
        type:String
    },
    country:{
        type:String
    },
    mobile:{
        type:Number,
        default:null
    },
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

const AddressModel = mongoose.model('address',AddressSchema)

export default AddressModel;