import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: {
         type: String ,
     },  // Store single image path
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],  
    subcategory: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],  
    unit: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    price: { type: Number, default: null },
    discount: { type: Number, default: null },
    description: { type: String, default: "" },
    more_details: { type: Object, default: {} },
    publish: { type: Boolean, default: true }
}, { timestamps: true });

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
