import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Fetch all products
export const fetchProducts = async () => {
  const response = await API.get("/products");
  return response.data.data;
};

// Create a new product (with image file)
export const createProduct = async (productData) => {
  const response = await API.post("/products", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
