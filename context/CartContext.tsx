"use client";

import { createContext, useContext, useReducer, useState, useEffect, ReactNode } from "react";
import { calculateConfigPrice, formatPriceFCFA } from "@/lib/pricing";

/* ── Types ─────────────────────────────────────────────── */
export type FlyItemData = {
  id: string;
  name: string;
  price?: number;
  startX?: number;
  startY?: number;
};

export type ServiceConfig = {
  designation: string;
  instanceCount?: number;
  os?: string;
  vcpu?: number;
  ram?: number;
  storage?: number;
  systemDisk?: number;
  systemDiskType?: "standard" | "advanced";
  dataDisk?: number;
  dataDiskType?: "standard" | "advanced";
  storageType?: "standard" | "advanced";
  rackUnits?: number;
  bandwidth?: number;
  duration?: number;
  gpuType?: string;
  gpuCount?: number;
  isObjectStorage?: boolean;
  objectStorageTier?: "standard" | "advanced";
  addons: string[]; // ids of selected managed services
  monthlyPrice?: number;
};

export type CartItem = {
  id: string; // Identifiant unique de l'instance dans le devis
  serviceId?: string; // Référence au service catalogue d'origine (ex: "cloud-iaas-vpc")
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
  | { type: "DUPLICATE_ITEM"; id: string; newItem: CartItem }
  | { type: "CLEAR_CART" };

/* ── Reducer ────────────────────────────────────────────── */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { items: action.items };
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex((i) => i.id === action.item.id);
      if (existingIndex >= 0) {
        const next = [...state.items];
        next[existingIndex] = action.item;
        return { items: next };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "UPDATE_CONFIG":
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, config: action.config } : i
        ),
      };
    case "DUPLICATE_ITEM":
      return { items: [...state.items, action.newItem] };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

/* ── Context ────────────────────────────────────────────── */
type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem, sourceCoords?: { x: number; y: number }) => void;
  removeItem: (id: string) => void;
  updateConfig: (id: string, config: ServiceConfig, sourceCoords?: { x: number; y: number }) => void;
  duplicateItem: (id: string, sourceCoords?: { x: number; y: number }) => void;
  clearCart: () => void;
  isInCart: (serviceIdOrId: string) => boolean;
  getItemsByService: (serviceId: string) => CartItem[];
  countByService: (serviceId: string) => number;
  count: number;
  getTotalMonthlyPrice: () => number;
  getFormattedTotalPrice: () => string;
  // Animation & Feedback
  flyingItem: FlyItemData | null;
  clearFlyingItem: () => void;
  lastAddedItem: CartItem | null;
  clearLastAddedItem: () => void;
  cartBounceKey: number;
  triggerCartBounce: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "ambra_cloud_devis_cart_v3";

/* ── Provider ───────────────────────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [flyingItem, setFlyingItem] = useState<FlyItemData | null>(null);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [cartBounceKey, setCartBounceKey] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Load from localStorage on mount (avec nettoyage/migration des anciens formats)
  useEffect(() => {
    try {
      // Nettoyage de l'ancienne clé v1 si présente
      localStorage.removeItem("ambra_cloud_devis_cart_v1");
      localStorage.removeItem("ambra_cloud_devis_cart_v2");
      
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Migration et assainissement
          const sanitized = parsed.map((item: CartItem) => {
            if (item.id === "colocation-tier-3") {
              return {
                ...item,
                config: {
                  designation: item.config?.designation || "Emplacement Baie Datacenter (1U)",
                  rackUnits: item.config?.rackUnits || 1,
                  duration: item.config?.duration || 12,
                  addons: item.config?.addons || [],
                  monthlyPrice: 35000 * (item.config?.rackUnits || 1),
                },
              };
            }
            return item;
          });
          dispatch({ type: "SET_ITEMS", items: sanitized });
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

  const triggerCartBounce = () => {
    setCartBounceKey((prev) => prev + 1);
  };

  const clearFlyingItem = () => {
    setFlyingItem(null);
  };

  const clearLastAddedItem = () => {
    setLastAddedItem(null);
  };

  const addItem = (item: CartItem, sourceCoords?: { x: number; y: number }) => {
    const baseServiceId = item.serviceId || item.id;
    const isGenericId = !item.id.includes("_inst_");
    const idExists = state.items.some((i) => i.id === item.id);

    const finalId = isGenericId && idExists
      ? `${baseServiceId}_inst_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`
      : item.id;

    const computedPrice = item.config
      ? calculateConfigPrice(item.config, item.basePrice ?? 0)
      : (item.basePrice ?? 0);
    const enrichedItem: CartItem = {
      ...item,
      id: finalId,
      serviceId: baseServiceId,
      config: item.config ? { ...item.config, monthlyPrice: computedPrice } : undefined,
    };
    dispatch({ type: "ADD_ITEM", item: enrichedItem });

    // Toast de notification
    setLastAddedItem(enrichedItem);

    // Animation de particule volante vers le panier
    setFlyingItem({
      id: finalId,
      name: enrichedItem.name,
      price: computedPrice,
      startX: sourceCoords?.x,
      startY: sourceCoords?.y,
    });

    // Rebond du panier dès l'impact
    setTimeout(() => {
      setCartBounceKey((prev) => prev + 1);
    }, 700);
  };

  const duplicateItem = (id: string, sourceCoords?: { x: number; y: number }) => {
    const target = state.items.find((i) => i.id === id);
    if (!target) return;

    const baseServiceId = target.serviceId || target.id.split("_inst_")[0];
    const newId = `${baseServiceId}_inst_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    const clonedDesignation = target.config?.designation
      ? `${target.config.designation} (Copie)`
      : `${target.name} (Copie)`;

    const clonedItem: CartItem = {
      ...target,
      id: newId,
      serviceId: baseServiceId,
      config: target.config
        ? {
            ...target.config,
            designation: clonedDesignation,
          }
        : undefined,
    };

    dispatch({ type: "DUPLICATE_ITEM", id, newItem: clonedItem });

    setLastAddedItem(clonedItem);

    setFlyingItem({
      id: newId,
      name: clonedItem.name,
      price: clonedItem.config?.monthlyPrice ?? clonedItem.basePrice,
      startX: sourceCoords?.x,
      startY: sourceCoords?.y,
    });

    setTimeout(() => {
      setCartBounceKey((prev) => prev + 1);
    }, 700);
  };

  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", id });

  const updateConfig = (id: string, config: ServiceConfig, sourceCoords?: { x: number; y: number }) => {
    const existing = state.items.find((i) => i.id === id);
    const computedPrice = calculateConfigPrice(config, existing?.basePrice ?? 0);
    const updatedItem: CartItem = {
      ...(existing || { id, name: config.designation || "Ressource Cloud", description: "", category: "" }),
      config: { ...config, monthlyPrice: computedPrice },
    };
    dispatch({
      type: "UPDATE_CONFIG",
      id,
      config: { ...config, monthlyPrice: computedPrice },
    });

    // Toast de notification
    setLastAddedItem(updatedItem);

    if (sourceCoords) {
      setFlyingItem({
        id,
        name: updatedItem.name,
        price: computedPrice,
        startX: sourceCoords.x,
        startY: sourceCoords.y,
      });
      setTimeout(() => {
        setCartBounceKey((prev) => prev + 1);
      }, 700);
    } else {
      setCartBounceKey((prev) => prev + 1);
    }
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const getItemsByService = (serviceId: string) => {
    return state.items.filter(
      (i) => i.serviceId === serviceId || i.id === serviceId || i.id.startsWith(`${serviceId}_inst_`)
    );
  };

  const countByService = (serviceId: string) => {
    return getItemsByService(serviceId).length;
  };

  const isInCart = (serviceIdOrId: string) => {
    return state.items.some(
      (i) =>
        i.id === serviceIdOrId ||
        i.serviceId === serviceIdOrId ||
        i.id.startsWith(`${serviceIdOrId}_inst_`)
    );
  };

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
        duplicateItem,
        clearCart,
        isInCart,
        getItemsByService,
        countByService,
        count: state.items.length,
        getTotalMonthlyPrice,
        getFormattedTotalPrice,
        flyingItem,
        clearFlyingItem,
        lastAddedItem,
        clearLastAddedItem,
        cartBounceKey,
        triggerCartBounce,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
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
