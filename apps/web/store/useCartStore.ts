import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  syncWithServer: () => Promise<void>;
};

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => {
        set((state) => ({
          cart: [...state.cart, item],
          totalItems: state.totalItems + 1,
        }));
        get().syncWithServer();
      },
      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
          totalItems: state.totalItems - 1,
        }));
        get().syncWithServer();
      },
      clearCart: () => {
        set({ cart: [], totalItems: 0 });
        get().syncWithServer();
      },
      totalItems: 0,
      syncWithServer: async () => {
        const { cart } = get();
        // Here you would make an API call to your Spring Boot backend
        // to sync the cart data
        try {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cart }),
          });
          if (!response.ok) {
            throw new Error("Failed to sync cart with server");
          }
        } catch (error) {
          console.error("Error syncing cart with server:", error);
        }
      },
    }),
    {
      name: "cart-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

export default useCartStore;
