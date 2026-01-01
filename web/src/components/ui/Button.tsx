import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

export function Button({ 
  className, 
  variant = "outline", 
  size = "md", 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center transition-all duration-300 font-serif tracking-widest uppercase",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        
        // Variants
        variant === "primary" && "bg-gold text-void-deep hover:bg-gold-light",
        variant === "outline" && "border border-gold/40 text-gold hover:border-gold hover:bg-gold/10",
        variant === "ghost" && "text-gold/60 hover:text-gold hover:bg-gold/5",

        // Sizes
        size === "sm" && "h-8 px-4 text-xs",
        size === "md" && "h-12 px-8 text-sm",
        size === "lg" && "h-14 px-10 text-base",
        size === "icon" && "h-10 w-10 p-0",

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
