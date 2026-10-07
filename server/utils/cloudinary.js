import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer_storage_cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "artisan-hub-products", // Cloudinary par kis folder mein save hoga
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], // Automatic optimization/resizing
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
