"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { calculateConfigPrice, formatPriceFCFA } from "@/lib/pricing";

/* ── Types ─────────────────────────────────────────────── */
export type ServiceConfig = {
  designation: string;
  vcpu?: number;
  ram?: number;
  storage?: number;
  duration?: number;
  gpuType?: string;
  gpuCount?: number;
  isObjectStorage?: boolean;
  addons: string[]; // ids of selected managed services
  monthlyPrice?: number;
};

export type CartItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice?: number;
  config?: ServiceConfig;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "SET_ITEMS"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_CONFIG"; id: string; config: ServiceConfig }
  | { type: "CLEAR_CART" };

/* ── Reducer ────────────────────────────────────────────── */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { items: action.items };
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
  getTotalMonthlyPrice: () => number;
  getFormattedTotalPrice: () => string;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "ambra_cloud_devis_cart_v1";

/* ── Provider ───────────────────────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_ITEMS", items: parsed });
        }
      }
    } catch {
      // fallback silent
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // fallback silent
    }
  }, [state.items]);

  const addItem = (item: CartItem) => {
    const computedPrice = item.config
      ? calculateConfigPrice(item.config, item.basePrice ?? 0)
      : (item.basePrice ?? 0);
    const enrichedItem = item.config
      ? { ...item, config: { ...item.config, monthlyPrice: computedPrice } }
      : item;
    dispatch({ type: "ADD_ITEM", item: enrichedItem });
  };

  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", id });

  const updateConfig = (id: string, config: ServiceConfig) => {
    const existing = state.items.find((i) => i.id === id);
    const computedPrice = calculateConfigPrice(config, existing?.basePrice ?? 0);
    dispatch({
      type: "UPDATE_CONFIG",
      id,
      config: { ...config, monthlyPrice: computedPrice },
    });
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const isInCart = (id: string) => !!state.items.find((i) => i.id === id);

  const getTotalMonthlyPrice = () => {
    return state.items.reduce((total, item) => {
      if (item.config) {
        return total + (calculateConfigPrice(item.config, item.basePrice ?? 0));
      }
      return total + (item.basePrice ?? 0);
    }, 0);
  };

  const getFormattedTotalPrice = () => {
    return formatPriceFCFA(getTotalMonthlyPrice());
  };

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
        getTotalMonthlyPrice,
        getFormattedTotalPrice,
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
