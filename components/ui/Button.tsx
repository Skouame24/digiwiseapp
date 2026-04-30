"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-dark text-white shadow-xl shadow-primary/25",
  secondary:
    "bg-white border border-taupe/20 text-navy hover:bg-cream shadow-sm",
  ghost: "bg-transparent text-taupe hover:text-primary",
};

export function Button({
  children,
  variant = "primary",
  href,
  icon,
  iconRight,
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm md:text-base transition-all active:scale-95",
    variantStyles[variant],
    className
  );

  const content = (
    <>
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
      {iconRight && <span className="inline-flex">{iconRight}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}
