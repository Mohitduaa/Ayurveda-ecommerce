import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
});

// ✅ Ensure Correct Model Name
const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);
export default SubCategoryModel;
