import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    storeName: { type: String, required: true, unique: true },
    address: { type: String, required: true }
});

const SellerModel = mongoose.model("Seller", SellerSchema);
export default SellerModel;
