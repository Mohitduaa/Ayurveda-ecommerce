// import express from "express";
// import jwt from "jsonwebtoken";
// import Seller from "../models/Seller.js";

// const router = express.Router();

// router.post("/seller", async (req, res) => {
//     try {
//         const { name, email, password, storeName, address, contact } = req.body;
//         if (!name || !email || !password || !storeName || !address || !contact) {
//             return res.sendStatus(400);
//         }

//         const existingUser = await Seller.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User Already Exists" });
//         }

//         const result = await Seller.create({ name, email, password, storeName, address, contact });
//         return res.status(201).json({ message: "Seller Created", seller: result });

//     } catch (error) {
//         return res.sendStatus(500);
//     }
// });

// router.post("/seller/bulk", async (req, res) => {
//     try {
//         const sellers = req.body;
//         if (!Array.isArray(sellers) || sellers.length === 0) {
//             return res.status(400).json({ message: "Invalid data provided" });
//         }

//         const emails = sellers.map(seller => seller.email);
//         const existingUsers = await Seller.find({ email: { $in: emails } });

//         if (existingUsers.length > 0) {
//             return res.status(400).json({ message: "Some users already exist", existingUsers });
//         }

//         const newSellers = await Seller.insertMany(sellers);
//         return res.status(201).json({ message: "Sellers Registered Successfully", newSellers });

//     } catch (error) {
//         return res.sendStatus(500);
//     }
// });

// router.get("/seller", async (req, res) => {
//     try {
//         const result = await Seller.find({});
//         return res.status(200).json({ message: "All sellers found", sellers: result });
//     } catch (error) {
//         return res.sendStatus(500);
//     }
// });

// router.get("/seller/:id", async (req, res) => {
//     try {
//         const seller = await Seller.findById(req.params.id);
//         if (!seller) {
//             return res.sendStatus(404);
//         }
//         return res.status(200).json({ seller });
//     } catch (error) {
//         return res.sendStatus(500);
//     }
// });

// router.post("/seller/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const seller = await Seller.findOne({ email });

//         if (!seller || seller.password !== password) {
//             return res.sendStatus(401);
//         }

//         const token = jwt.sign(
//             { id: seller._id, email: seller.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         return res.status(200).json({ message: "Login Successful", token });
//     } catch (error) {
//         return res.sendStatus(500);
//     }
// });

// router.put("/seller/:id", async (req, res) => {
//     try {
//         const updatedUser = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });

//         if (!updatedUser) {
//             return res.sendStatus(400);
//         }

//         return res.status(200).json({ message: "User Updated Successfully", updatedUser });
//     } catch (error) {
//         return res.sendStatus(500);
//     }
// });

// router.patch("/seller/:id", async (req, res) => {
//     try {
//         const updatedUser = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });

//         if (!updatedUser) {
//             return res.sendStatus(400);
//         }

//         return res.status(200).json({ message: "User Updated Successfully", updatedUser });
//     } catch (error) {
//         return res.sendStatus(500);
//     }
// });

// router.delete("/seller/:id", async (req, res) => {
//     try {
//         const deletedUser = await Seller.findByIdAndDelete(req.params.id);
//         if (!deletedUser) {
//             return res.sendStatus(400);
//         }

//         return res.sendStatus(204);
//     } catch (error) {
//         return res.sendStatus(500);
//     }
// });

// export default router;
