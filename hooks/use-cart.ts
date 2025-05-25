"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isEmpty: boolean;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,
      isEmpty: true,
      
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          return set((state) => {
            const updatedItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            
            const itemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
            const subtotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
            
            return {
              items: updatedItems,
              itemCount,
              subtotal,
              isEmpty: false,
            };
          });
        }
        
        set((state) => {
          const updatedItems = [...state.items, item];
          const itemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
          const subtotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
          
          return {
            items: updatedItems,
            itemCount,
            subtotal,
            isEmpty: false,
          };
        });
      },
      
      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          const itemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
          const subtotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
          
          return {
            items: updatedItems,
            itemCount,
            subtotal,
            isEmpty: updatedItems.length === 0,
          };
        });
      },
      
      updateItemQuantity: (id, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          
          const itemCount = updatedItems.reduce((count, item) => count + item.quantity, 0);
          const subtotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
          
          return {
            items: updatedItems,
            itemCount,
            subtotal,
            isEmpty: false,
          };
        });
      },
      
      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          isEmpty: true,
        });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);