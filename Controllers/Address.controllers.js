import AddressModel from "../Models/Address.Model.js";
import UserModel from "../Models/User.Model.js";
import mongoose from "mongoose";

export async function createAddress(req, res) {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ message: "User ID is required", error: true, success: false });
        }

        // Create new address
        const address = new AddressModel(req.body);
        await address.save();

        // Link address to user
        await UserModel.findByIdAndUpdate(userId, { $push: { addres_details: address._id } });

        res.status(201).json({
            message: "Address created and linked successfully",
            error: false,
            success: true,
            data: address
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function getUserAddresses(req, res) {
    try {
        const userId = req.user?.id || req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required", error: true, success: false });
        }

        // Populate user addresses
        const user = await UserModel.findById(userId).populate("addres_details");
        if (!user) {
            return res.status(404).json({ message: "User not found", error: true, success: false });
        }

        res.status(200).json({
            message: "User addresses fetched successfully",
            error: false,
            success: true,
            data: user.addres_details
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function getAddressById(req, res) {
    try {
        const { id } = req.params; 
        console.log("Requested Address ID:", id); 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Address ID", error: true, success: false });
        }

        const address = await AddressModel.findById(id);
        if (!address) {
            return res.status(404).json({ message: "Address not found", error: true, success: false });
        }

        res.status(200).json({
            message: "Address fetched successfully",
            error: false,
            success: true,
            data: address
        });
    } catch (error) {
        console.error("Error Fetching Address:", error);
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function updateAddress(req, res) {
    try {
        const id = req.params.id || req.query.id; 
        

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Address ID", error: true, success: false });
        }

        const updatedAddress = await AddressModel.findByIdAndUpdate(
            id, 
            { $set: req.body }, 
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found", error: true, success: false });
        }

        res.status(200).json({
            message: "Address updated successfully",
            error: false,
            success: true,
            data: updatedAddress
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function deleteAddress(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || req.userId;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Address ID", error: true, success: false });
        }

        // Delete address
        const deletedAddress = await AddressModel.findByIdAndDelete(id);
        if (!deletedAddress) {
            return res.status(404).json({ message: "Address not found", error: true, success: false });
        }

        // Remove address reference from user
        await UserModel.findByIdAndUpdate(userId, { $pull: { addres_details: id } });

        res.status(200).json({
            message: "Address deleted successfully",
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
