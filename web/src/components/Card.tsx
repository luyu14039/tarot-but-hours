"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HourCard } from "@/data/hours";
import { cn } from "@/lib/utils";

interface CardProps {
  card: HourCard;
  isFlipped: boolean;
  isReversed?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  width?: number;
  height?: number;
}

export function Card({
  card,
  isFlipped,
  isReversed = false,
  onClick,
  className,
  disabled,
  width = 200,
  height = 300,
}: CardProps) {
  return (
    <div
      className={cn("relative perspective-1000 cursor-pointer group", className)}
      style={{ width, height }}
      onClick={!disabled ? onClick : undefined}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-shadow duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        whileHover={!disabled ? { scale: 1.02, y: -5 } : {}}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl border-2 border-gold/30 bg-void-deep shadow-xl flex items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Pattern for Card Back */}
          <div className="absolute inset-2 border border-gold/20 rounded-lg opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-gold)_1px,_transparent_1px)] bg-[length:20px_20px] opacity-10" />
          <div className="w-16 h-16 rounded-full border-2 border-gold/40 flex items-center justify-center">
             <div className="w-10 h-10 rotate-45 border border-gold/30" />
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl border border-gold/50 bg-black shadow-2xl overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden", 
            transform: `rotateY(180deg) ${isReversed ? 'rotateZ(180deg)' : ''}` 
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={card.imagePath}
              alt={card.name}
              fill
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 sepia-[0.3] contrast-110"
              sizes={`${width}px`}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />
            
            {/* Card Text */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <p className="text-gold text-xs tracking-widest uppercase mb-1 font-serif opacity-80">
                {card.romanId}
              </p>
              <h3 className="text-gold-light font-serif text-lg tracking-wide drop-shadow-md">
                {card.name}
              </h3>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
