"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "dark" | "featured";
  className?: string;
}

export function Card({ children, variant = "default", className }: CardProps) {
  return (
    <div
      className={cn(
        "p-8 rounded-2xl transition-all",
        variant === "default" &&
          "bg-white border border-taupe/20 hover:border-primary/30",
        variant === "dark" &&
          "bg-navy border border-primary shadow-2xl shadow-primary/10",
        variant === "featured" &&
          "bg-white border-2 border-primary shadow-xl shadow-primary/10",
        className
      )}
    >
      {children}
    </div>
  );
}
