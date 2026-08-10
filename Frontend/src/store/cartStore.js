import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      
      addItem: (product) =>
        set((state) => {
          // Check if item already exists
          const exists = state.items.find((item) => item._id === product._id);
          if (exists) {
            return state; // Don't add duplicates
          }
          return { items: [...state.items, product] };
        }),
      
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
