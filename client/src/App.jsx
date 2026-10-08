import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./services/api";
import { useCartStore } from "./store/useCartStore";
import Navbar from "./components/Navbar";
import AddProductModal from "./components/AddProductModal";
import { Plus, ShoppingCart, Sparkles, Trash2, X } from "lucide-react";

export default function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Zustand cart store actions & state
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // TanStack Query to fetch products with automatic caching
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 w-full overflow-x-hidden">
      {/* Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Banner - Full Screen Stretch */}
      <section className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white py-16 px-6 lg:px-12 shadow-md w-full">
        <div className="w-full text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Handmade Crafts & Local Treasures
          </h1>
          <p className="text-amber-100 text-base md:text-lg leading-relaxed font-light">
            Directly supporting local artisans and craftsmen. Browse authentic
            handmade goods or upload your own creations instantly with secure
            cloud storage.
          </p>
        </div>
      </section>

      {/* Main Content Container - Full Width */}
      <main className="w-full px-6 lg:px-12 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-600" /> Featured
              Collection
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Explore unique masterpieces crafted by verified local creators
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-semibold hover:bg-slate-800 transition shadow-sm flex items-center gap-2 text-sm"
          >
            <ShoppingCart className="w-4 h-4" /> View Cart ({cart.length})
          </button>
        </div>

        {/* Loading and Error states */}
        {isLoading && (
          <div className="text-center py-24 text-slate-400 text-lg font-medium">
            Loading local crafts...
          </div>
        )}

        {error && (
          <div className="text-center py-24 text-rose-500 text-lg font-medium bg-white rounded-3xl border border-slate-100 shadow-sm mx-auto max-w-xl">
            ⚠️ Error loading products. Make sure your backend server is running
            on port 5000!
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-xl mx-auto p-8">
            <p className="text-slate-500 mb-4 font-medium">
              No products found yet. Start by adding your first craft!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-amber-700 transition shadow-sm"
            >
              + Add First Product
            </button>
          </div>
        )}

        {/* Products Grid - Optimized for full width responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col group"
            >
              <div className="h-56 overflow-hidden bg-slate-100 relative">
                <img
                  src={product.image.url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide">
                  {product.category}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-800 mb-1.5 group-hover:text-amber-700 transition">
                  {product.name}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      Price
                    </span>
                    <span className="text-amber-700 font-extrabold text-lg">
                      PKR {product.price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-amber-50 text-amber-800 px-3.5 py-2 rounded-2xl hover:bg-amber-600 hover:text-white transition-all font-semibold text-sm flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Slide-over Sidebar Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 transition-all">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <ShoppingCart className="w-6 h-6 text-amber-600" /> Your
                Shopping Cart
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center text-slate-400 py-20">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100 gap-3"
                  >
                    <img
                      src={item.image.url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl shadow-xs"
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm text-slate-800">
                        {item.name}
                      </h4>
                      <p className="text-slate-500 text-xs mt-0.5">
                        PKR {item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-rose-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center font-bold text-lg mb-4">
                  <span className="text-slate-600">Total Amount:</span>
                  <span className="text-amber-700">
                    PKR {totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    alert("Order placed successfully! (Demo Checkout)");
                    clearCart();
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-amber-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-amber-700 transition shadow-sm mb-2.5"
                >
                  Checkout Order
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-slate-100 text-slate-600 py-2.5 rounded-2xl font-medium hover:bg-slate-200 transition text-sm"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
