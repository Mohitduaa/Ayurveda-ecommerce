import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        default:null
    },
    image:{
        type:String,
        default:""
    }

},{
    timestamps:true
})

const CategoryModel = mongoose.model('Category',CategorySchema)

export default CategoryModel;