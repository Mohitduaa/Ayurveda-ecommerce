import CategoryModel from "../Models/Category.model.js";

export async function createCategory(req, res) {
    try {
        const { name, image } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required",
                error: true,
                success: false
            });
        }

        const category = new CategoryModel({ name, image });
        await category.save();

        res.status(201).json({
            message: "Category created successfully",
            error: false,
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function getAllCategories(req, res) {
    try {
        const categories = await CategoryModel.find();

        res.status(200).json({
            message: "Categories fetched successfully",
            error: false,
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function getCategoryById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Category ID", error: true, success: false });
        }

        const category = await CategoryModel.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found", error: true, success: false });
        }

        res.status(200).json({
            message: "Category fetched successfully",
            error: false,
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name, image } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Category ID", error: true, success: false });
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            id,
            { $set: { name, image } },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found", error: true, success: false });
        }

        res.status(200).json({
            message: "Category updated successfully",
            error: false,
            success: true,
            data: updatedCategory
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Category ID", error: true, success: false });
        }

        const deletedCategory = await CategoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found", error: true, success: false });
        }

        res.status(200).json({
            message: "Category deleted successfully",
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
