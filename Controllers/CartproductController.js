import CartproductModel from "../Models/Cartproduct.Model.js"; 
import ProductModel from "../Models/Product.model.js"; 
import UserModel from "../Models/User.Model.js"; 
import mongoose from "mongoose";
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user?.id || new mongoose.Types.ObjectId(); 

        console.log("Request Body:", req.body); 
        console.log("User ID:", userId); 

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Validate product
        const product = await ProductModel.findById(productId);
        if (!product) {
            console.log("Product not found for ID:", productId); // Debug product check
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the product already exists in the user's cart
        const existingCartProduct = await CartproductModel.findOne({ userId, productId });
        console.log("Existing Cart Product:", existingCartProduct); // Debug existing cart product

        if (existingCartProduct) {
            existingCartProduct.quantity += quantity || 1;
            await existingCartProduct.save();
            return res.status(200).json({ message: "Product quantity updated in the cart", cart: existingCartProduct });
        }

        // Add the product to the cart
        const newCartProduct = new CartproductModel({ productId, quantity: quantity || 1, userId });
        await newCartProduct.save();
        res.status(201).json({ message: "Product added to the cart", cart: newCartProduct });
    } catch (error) {
        console.error("Error in addToCart:", error); // Improved error logging
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get the cart details for a user
// export const getCart = async (req, res) => {
//     try {
//         // Directly extract userId from request (body, query, or headers)
//         const userId = req.body.userId || req.query.userId || req.headers["user-id"];

//         console.log("Extracted User ID:", userId); // Debugging the user ID

//         // Validate userId
//         if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ message: "Invalid or missing user ID" });
//         }

//         // Find all cart items for the user and populate product details
//         const cart = await CartproductModel.find({ userId }).populate(
//             "productId",
//             "name price description"
//         );

//         // Handle empty cart
//         if (cart.length === 0) {
//             return res.status(200).json({ message: "Your cart is empty", cart: [] });
//         }

//         // Format the cart response (if needed, otherwise return as is)
//         const formattedCart = cart.map((item) => ({
//             id: item._id,
//             product: {
//                 id: item.productId._id,
//                 name: item.productId.name,
//                 price: item.productId.price,
//                 description: item.productId.description,
//             },
//             quantity: item.quantity,
//             userId: item.userId,
//             createdAt: item.createdAt,
//             updatedAt: item.updatedAt,
//         }));

//         // Return the formatted cart items
//         res.status(200).json({ cart: formattedCart });
//     } catch (error) {
//         console.error("Error in getCart:", error); // Log the error
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };
export const getCart = async (req, res) => {
    try {
        // Fetch all cart items
        const cart = await CartproductModel.find()
            .populate("productId", "name price description")
            .lean(); // Optional: Converts MongoDB documents to plain JS objects

        // Handle empty cart
        if (cart.length === 0) {
            return res.status(200).json({ message: "Your cart is empty", cart: [] });
        }

        // Return all cart items
        res.status(200).json({ cart });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};






export const updateCart = async (req, res) => {
    try {
        const { cartProductId, quantity } = req.body;

        // Check if cartProductId is valid
        if (!mongoose.Types.ObjectId.isValid(cartProductId)) {
            return res.status(400).json({ message: "Invalid cartProductId format" });
        }

        // Find the cart item by ID
        const cartProduct = await CartproductModel.findById(cartProductId);
        if (!cartProduct) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Update the quantity
        cartProduct.quantity = quantity;
        await cartProduct.save();

        res.status(200).json({ message: "Cart item updated", cart: cartProduct });
    } catch (error) {
        console.error("Error in updateCart:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// Remove a product from the cart
export const removeFromCart = async (req, res) => {
    try {
        const { cartProductId } = req.params;

        const cartProduct = await CartproductModel.findByIdAndDelete(cartProductId);
        if (!cartProduct) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Product removed from the cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


