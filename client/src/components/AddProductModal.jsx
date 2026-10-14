import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../services/api";
import { X, Upload, Loader2, Trash2 } from "lucide-react";

const CATEGORIES = [
  "Handmade Crafts",
  "Pottery",
  "Textiles",
  "Jewelry",
  "Woodwork",
  "Leather Goods",
  "Art & Decor",
  "Other",
];

const MAX_IMAGE_SIZE_MB = 5;
const MAX_DESCRIPTION = 500;

const inputClass =
  "mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 transition";

export default function AddProductModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory(CATEGORIES[0]);
    setImageFile(null);
    setPreview(null);
    setImageError("");
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetForm();
      onClose();
    },
  });

  const handleClose = useCallback(() => {
    if (mutation.isPending) return;
    mutation.reset();
    resetForm();
    onClose();
  }, [mutation, resetForm, onClose]);

  // Escape to close + lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, handleClose]);

  // Revoke preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setImageError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e) => processFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imageFile) {
      setImageError("Please select a product image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", imageFile);

    mutation.mutate(formData);
  };

  if (!isOpen) return null;

  const serverError =
    mutation.error?.response?.data?.message || mutation.error?.message || "";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2
          id="add-product-title"
          className="text-2xl font-bold text-gray-800 mb-1"
        >
          Add New Craft / Product
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Fill in the details below to list your product.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="product-name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Handmade Clay Vase"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="product-price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (PKR)
              </label>
              <input
                id="product-price"
                type="number"
                required
                min="1"
                step="1"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={inputClass}
                placeholder="2500"
              />
            </div>
            <div>
              <label
                htmlFor="product-category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${inputClass} bg-white`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="product-description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <span
                className={`text-xs ${
                  description.length >= MAX_DESCRIPTION
                    ? "text-rose-500"
                    : "text-gray-400"
                }`}
              >
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <textarea
              id="product-description"
              required
              rows={3}
              maxLength={MAX_DESCRIPTION}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Describe the craft or item..."
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </span>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative flex items-center justify-center border-2 border-dashed rounded-xl p-4 min-h-[9rem] cursor-pointer transition ${
                isDragging
                  ? "border-amber-500 bg-amber-50"
                  : imageError
                    ? "border-rose-300 bg-rose-50/40"
                    : "border-gray-300 hover:border-amber-500 hover:bg-amber-50/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                aria-label="Upload product image"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-32 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="Remove image"
                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 text-rose-600 rounded-full shadow hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="text-center pointer-events-none">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    PNG, JPG, WEBP up to {MAX_IMAGE_SIZE_MB}MB
                  </p>
                </div>
              )}
            </div>
            {imageError && (
              <p className="mt-1.5 text-xs text-rose-600" role="alert">
                {imageError}
              </p>
            )}
          </div>

          {serverError && (
            <div
              role="alert"
              className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2"
            >
              {serverError}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={mutation.isPending}
              className="flex-1 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-[2] flex items-center justify-center gap-2 bg-amber-600 text-white py-2.5 rounded-lg font-semibold hover:bg-amber-700 active:scale-[0.99] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Publish Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
