import React from "react";
import { ShoppingBag, Store } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

export default function Navbar({ onOpenAddModal, onOpenCart }) {
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full border-b border-slate-100">
      <div className="w-full px-6 lg:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="bg-amber-100 p-2.5 rounded-2xl shadow-sm">
            <Store className="w-6 h-6 text-amber-700" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">
            LocalArtisan <span className="text-amber-600">Hub</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenAddModal}
            className="bg-amber-600 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-sm hover:bg-amber-700 hover:shadow transition-all duration-200 text-sm flex items-center gap-2"
          >
            <span>+ Add Product</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex items-center bg-slate-100 p-3 rounded-2xl cursor-pointer hover:bg-slate-200 transition"
          >
            <ShoppingBag className="w-5 h-5 text-slate-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
