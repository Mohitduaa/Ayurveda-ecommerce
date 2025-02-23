import CartproductModel from "../Models/Cartproduct.Model.js"; 
import ProductModel from "../Models/Product.model.js"; 
import UserModel from "../Models/User.Model.js"
import mongoose from "mongoose";
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingCartItem = await CartproductModel.findOne({ userId, productId });

        if (existingCartItem) {
            existingCartItem.quantity += quantity || 1;
            await existingCartItem.save();
            return res.status(200).json({ message: "Product quantity updated", cartItem: existingCartItem });
        }

        const newCartItem = new CartproductModel({ productId, quantity: quantity || 1, userId });
        await newCartItem.save();

        res.status(201).json({ message: "Product added to cart", cartItem: newCartItem });
    } catch (error) {
        console.error("Error in addToCart:", error);
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
        const { productId, quantity } = req.body;
        const userId = req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const cartItem = await CartproductModel.findOne({ userId, productId });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: "Cart updated", cartItem });
    } catch (error) {
        console.error("Error in updateCart:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



// Remove a product from the cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const cartItem = await CartproductModel.findOneAndDelete({ userId, productId });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



