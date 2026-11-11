"use client";

import { CartProvider } from "@/context/CartContext";
import { CartFlyAnimation } from "@/components/cart/CartFlyAnimation";
import { CartNotificationToast } from "@/components/cart/CartNotificationToast";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartFlyAnimation />
      <CartNotificationToast />
    </CartProvider>
  );
}
