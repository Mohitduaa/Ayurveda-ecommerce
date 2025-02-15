import OrderModel from "../Models/Order.Model.js";
import UserModel from "../Models/User.Model.js";
import ProductModel from "../Models/Product.model.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { userId, orderId, productId, product_details, paymentId, payment_status, delivery_address, subTotalAmt, totalAmt, invoice_receipt } = req.body;

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Create the order
    const newOrder = await OrderModel.create({
      userId,
      orderId,
      productId,
      product_details,
      paymentId,
      payment_status,
      delivery_address,
      subTotalAmt,
      totalAmt,
      invoice_receipt,
    });

    res.status(201).json({ success: true, message: "Order created successfully", data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create order", error: error.message });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .populate("productId", "name price image")
      .populate("delivery_address");

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve orders", error: error.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await OrderModel.findById(id)
      .populate("userId", "name email")
      .populate("productId", "name price image")
      .populate("delivery_address");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve order", error: error.message });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order updated successfully", data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order", error: error.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await OrderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete order", error: error.message });
  }
};