import React from "react";
import { cn } from "@/lib/utils";

interface FrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function Frame({ children, className, hoverEffect = false, ...props }: FrameProps) {
  return (
    <div
      className={cn(
        "relative border border-gold/30 bg-void-deep/50 p-6 transition-all duration-500",
        hoverEffect && "hover:border-gold hover:bg-void-deep/80 hover:shadow-[0_0_15px_rgba(197,160,89,0.1)]",
        className
      )}
      {...props}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold opacity-50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold opacity-50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold opacity-50" />
      
      {children}
    </div>
  );
}
