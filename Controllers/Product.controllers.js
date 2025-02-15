import ProductModel from "../Models/Product.model.js";
import CategoryModel from "../Models/Category.model.js";
import subcategory from "../Models/Subcategory.model.js"
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'
import multer from "multer";
import mongoose from "mongoose";
// import multer from "multer";

export async function createProduct(req, res) {
    try {
        const { name, category, subcategory, unit, stock, price, discount, description } = req.body;
        const image = req.file;

        if (!name || !category || !price) {
            return res.status(400).json({
                message: "Name, category, and price are required",
                error: true,
                success: false,
            });
        }

        if (!image) {
            return res.status(400).json({
                message: "Image file is required",
                error: true,
                success: false,
            });
        }

        let imagee;
        try {
            imagee = await uploadImageCloudinary(image);
        } catch (err) {
            return res.status(500).json({
                message: "Failed to upload image to Cloudinary",
                error: true,
                success: false,
            });
        }

        const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

        const formattedCategory = category
            ? (Array.isArray(category)
                ? category.filter(isValidObjectId).map(id => new mongoose.Types.ObjectId(id))
                : isValidObjectId(category)
                ? [new mongoose.Types.ObjectId(category)]
                : [])
            : [];

        const formattedSubcategory = subcategory
            ? (Array.isArray(subcategory)
                ? subcategory.filter(isValidObjectId).map(id => new mongoose.Types.ObjectId(id))
                : isValidObjectId(subcategory)
                ? [new mongoose.Types.ObjectId(subcategory)]
                : [])
            : [];

        console.log("Formatted Category IDs:", formattedCategory);
        console.log("Formatted Subcategory IDs:", formattedSubcategory);

        const product = new ProductModel({
            name,
            category: formattedCategory,
            subcategory: formattedSubcategory,
            unit: unit || "defaultUnit",
            stock: stock || 0,
            price,
            discount: discount || 0,
            description: description || "",
            image: imagee.url,
        });

        await product.save();

        res.status(201).json({
            message: "Product created successfully",
            error: false,
            success: true,
            data: { id: product._id, ...product._doc },
        });
    } catch (error) {
        console.error("Error Creating Product:", error);
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}

export async function getAllProducts(req, res) {
    try {
        console.log("Fetching all products..."); // ✅ Debugging

        const products = await ProductModel.find()
            .populate("category", "name image")  // ✅ Ensure Correct Population
            .populate("subcategory", "name image");

        console.log("Fetched Products Count:", products.length); // ✅ Debugging

        if (products.length === 0) {
            return res.status(404).json({
                message: "No products found",
                error: false,
                success: true,
                data: []
            });
        }

        res.status(200).json({
            message: "Products fetched successfully",
            error: false,
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error Fetching Products:", error); // ✅ Debugging
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        console.log("Fetching Product ID:", id); // ✅ Debugging

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product ID", error: true, success: false });
        }

        const product = await ProductModel.findById(id)
            .populate("category")
            .populate("subcategory");

        if (!product) {
            return res.status(404).json({ message: "Product not found", error: true, success: false });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            error: false,
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error Fetching Product:", error); // ✅ Debugging
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}


export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        console.log("Updating Product ID:", id); // ✅ Debugging
        console.log("Update Data:", req.body); // ✅ Debugging

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product ID", error: true, success: false });
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found", error: true, success: false });
        }

        res.status(200).json({
            message: "Product updated successfully",
            error: false,
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error("Update Error:", error); // ✅ Debugging
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}


export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Product ID", error: true, success: false });
        }

        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found", error: true, success: false });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            error: false,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}
