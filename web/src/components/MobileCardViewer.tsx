"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileCardViewerProps {
  cards: any[];
  flippedIndices: number[];
  onCardFlip: (index: number) => void;
  onCardFocus: (index: number) => void;
}

export function MobileCardViewer({
  cards,
  flippedIndices,
  onCardFlip,
  onCardFocus,
}: MobileCardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCardClick = () => {
    if (!flippedIndices.includes(currentIndex)) {
      onCardFlip(currentIndex);
    } else {
      onCardFocus(currentIndex);
    }
  };

  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full flex flex-col items-center gap-4 py-2">
      {/* Navigation & Card Container */}
      <div className="relative w-full flex justify-center items-center min-h-[420px]">
        
        {/* Left Button - Absolute */}
        <div className="absolute left-0 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={cn(
              "text-gold/50 hover:text-gold", 
              currentIndex === 0 && "opacity-0 pointer-events-none"
            )}
          >
            <ChevronLeft size={32} />
          </Button>
        </div>

        {/* Card - Centered */}
        <div className="relative w-[280px] h-[420px] shrink-0 z-10">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                >
                     <div className="w-full h-full relative group">
                        <Card
                            card={cards[currentIndex]}
                            isFlipped={flippedIndices.includes(currentIndex)}
                            isReversed={cards[currentIndex].isReversed}
                            onClick={handleCardClick}
                            className="w-full h-full shadow-[0_0_30px_rgba(197,160,89,0.15)]"
                            width={280}
                            height={420}
                        />
                        {/* Glow effect for unflipped */}
                        {!flippedIndices.includes(currentIndex) && (
                        <div className="absolute inset-0 rounded-xl bg-gold/5 animate-pulse pointer-events-none" />
                        )}
                     </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Right Button - Absolute */}
        <div className="absolute right-0 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className={cn(
              "text-gold/50 hover:text-gold", 
              currentIndex === cards.length - 1 && "opacity-0 pointer-events-none"
            )}
          >
            <ChevronRight size={32} />
          </Button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex gap-3">
        {cards.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 border border-gold/30",
              idx === currentIndex ? "bg-gold w-4" : "bg-transparent"
            )}
          />
        ))}
      </div>
      
      <p className="text-xs text-gold/40 font-serif tracking-widest">
        {flippedIndices.includes(currentIndex) ? "点击查看详情" : "点击翻开牌面"}
      </p>
    </div>
  );
}
