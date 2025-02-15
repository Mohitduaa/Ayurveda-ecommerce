import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()


if(!process.env.MONGODB_URI){
    throw new Error(
        "Please provide MONGODB_URI IN THE .ENV FILE"
    )
}

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connect Db sucessfully");
        
    } catch (Error){
        console.log("Mongodb connect error",Error);
        process.exit(1)
        
    }
}
export default connectDB;