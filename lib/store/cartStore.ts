import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addService: (item: Omit<CartItem, "quantity">) => void;
  removeService: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

const mockServices: CartItem[] = [
  {
    id: "cloud-resident",
    name: "Cloud Résident",
    description: "Infrastructure partagée hautement sécurisée en France",
    price: 299,
    quantity: 0,
  },
  {
    id: "cloud-prive",
    name: "Cloud Privé",
    description: "Isolation totale sur matériel dédié haute performance",
    price: 999,
    quantity: 0,
  },
  {
    id: "services-manages",
    name: "Services Managés",
    description: "Pilotage infrastructure 24/7 par nos experts",
    price: 499,
    quantity: 0,
  },
];

export const useCartStore = create<CartState>((set, get) => ({
  items: mockServices,

  addService: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeService: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  clearCart: () => set({ items: mockServices.map((s) => ({ ...s, quantity: 0 })) }),

  total: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
