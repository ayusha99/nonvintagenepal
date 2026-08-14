import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const maxStock = product.stock ?? 1;
          const existing = state.items.find((item) => item._id === product._id);
          if (existing) {
            const newQty = Math.min((existing.quantity || 1) + quantity, maxStock);
            return {
              items: state.items.map((item) =>
                item._id === product._id ? { ...item, quantity: newQty, stock: maxStock } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: Math.min(quantity, maxStock), stock: maxStock }] };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item._id !== productId)
              : state.items.map((item) => {
                  if (item._id !== productId) return item;
                  const maxStock = item.stock ?? 1;
                  return { ...item, quantity: Math.min(quantity, maxStock) };
                }),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),

      removeItems: (productIds) =>
        set((state) => ({
          items: state.items.filter((item) => !productIds.includes(item._id)),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
