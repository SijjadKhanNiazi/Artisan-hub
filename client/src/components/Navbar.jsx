import { ShoppingBag, Store } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

export default function Navbar({ onOpenAddModal }) {
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Store className="w-8 h-8 text-amber-600" />
          <span className="text-xl font-bold text-gray-800">
            LocalArtisan Hub
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenAddModal}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-700 transition"
          >
            + Add Product (For Business)
          </button>

          <div className="relative flex items-center bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition">
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
