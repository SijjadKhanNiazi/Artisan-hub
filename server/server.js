import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

//Adding Routes
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/artisan-hub";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => console.error(" MongoDB Connection Error:", err));

// Test Route
app.use("/api/products", productRoutes);
app.get("/", (req, res) => {
  res.send("Artisan Hub API is running...");
});

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
