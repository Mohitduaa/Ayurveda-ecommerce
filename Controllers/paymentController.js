import Razorpay from "razorpay";
import crypto from "crypto";
import OrderModel from "../Models/Order.Model.js";
// ✅ Razorpay instance setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    console.log("Received request headers:", req.headers); // ✅ Check headers
    console.log("Extracted userId:", req.userId); // ✅ Check if userId exists

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - User ID missing" });
    }
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || !receipt) {
      return res.status(400).json({ success: false, message: "Missing amount or receipt" });
    }

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency,
      receipt,
      payment_capture: 1,
    };

    console.log("Creating order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("Order created successfully:", order);

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment order creation failed",
      error: error.message,
    });
  }
};

  

// ✅ Verify Payment & Save Order


export const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId; // Ensure userId is taken from auth middleware
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems, addressId } = req.body;

    console.log("Received Data:", req.body); // 🛠️ Debugging

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("Generated Signature:", generatedSignature);
    console.log("Received Signature:", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature, payment failed!" });
    }

    // ✅ Save order in database
    const newOrder = new OrderModel({
      userId,
      orderId: razorpay_order_id,
      products: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      })),
      paymentId: razorpay_payment_id,
      payment_status: "Paid",
      delivery_address: addressId,
      subTotalAmt: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      totalAmt: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });

    await newOrder.save();

    res.status(200).json({ success: true, message: "Payment verified & order placed!", order: newOrder });
  } catch (error) {
    console.error("Verification Error:", error.message);
    res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
  }
};

