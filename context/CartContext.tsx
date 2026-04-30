"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

/* ── Types ─────────────────────────────────────────────── */
export type ServiceConfig = {
  designation: string;
  vcpu?: number;
  ram?: number;
  storage?: number;
  duration?: number;
  addons: string[]; // ids of selected managed services
};

export type CartItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  config?: ServiceConfig;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_CONFIG"; id: string; config: ServiceConfig }
  | { type: "CLEAR_CART" };

/* ── Reducer ────────────────────────────────────────────── */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      if (state.items.find((i) => i.id === action.item.id)) return state;
      return { items: [...state.items, action.item] };
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "UPDATE_CONFIG":
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, config: action.config } : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

/* ── Context ────────────────────────────────────────────── */
type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateConfig: (id: string, config: ServiceConfig) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

/* ── Provider ───────────────────────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", item });
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", id });
  const updateConfig = (id: string, config: ServiceConfig) =>
    dispatch({ type: "UPDATE_CONFIG", id, config });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const isInCart = (id: string) => !!state.items.find((i) => i.id === id);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateConfig,
        clearCart,
        isInCart,
        count: state.items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ── Hook ───────────────────────────────────────────────── */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
