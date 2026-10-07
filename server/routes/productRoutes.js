import express from "express";
import Product from "../models/Product.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new product with image upload
// @route   POST /api/products
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Check if image file is provided by multer-storage-cloudinary
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image file" });
    }

    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      image: {
        url: req.file.path, // Cloudinary secure URL
        public_id: req.file.filename, // Cloudinary public ID for deletion/management
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
