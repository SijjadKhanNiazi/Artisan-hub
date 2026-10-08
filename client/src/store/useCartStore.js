import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find(
          (item) => item._id === product._id,
        );

        if (existingItem) {
          set({
            cart: currentCart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item._id !== productId) });
      },
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "artisan-cart-storage", // LocalStorage mein save rahega taake refresh hone par data na jaye
    },
  ),
);
