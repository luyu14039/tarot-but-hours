"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useAnimation, PanInfo } from "framer-motion";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";
import { AspectIcon } from "@/components/AspectIcon";
import { Frame } from "@/components/ui/Frame";
import { Button } from "@/components/ui/Button";
import { X, ChevronDown } from "lucide-react";

interface MobileReadingCarouselProps {
  cards: any[];
  flippedIndices: number[];
  focusedIndex: number | null;
  setFocusedIndex: (index: number | null) => void;
  onCardFlip: (index: number) => void;
}

export function MobileReadingCarousel({
  cards,
  flippedIndices,
  focusedIndex,
  setFocusedIndex,
  onCardFlip,
}: MobileReadingCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const controls = useAnimation();
  
  const CARD_WIDTH = 280;
  const GAP = 16;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Calculate the X position to center the target index
  const getXForIndex = (index: number) => {
    if (containerWidth === 0) return 0;
    const center = containerWidth / 2;
    const cardHalf = CARD_WIDTH / 2;
    const cardStart = index * (CARD_WIDTH + GAP);
    return center - cardHalf - cardStart;
  };

  // Sync carousel position when focusedIndex changes
  useEffect(() => {
    if (focusedIndex !== null) {
      controls.start({
        x: getXForIndex(focusedIndex),
        transition: { type: "spring", stiffness: 300, damping: 30 }
      });
    }
  }, [focusedIndex, containerWidth, controls]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    // Determine direction
    // If dragged significantly or flicked
    let newIndex = focusedIndex ?? 0;
    
    if (Math.abs(velocity) > 500 || Math.abs(offset) > CARD_WIDTH / 3) {
      if (velocity < 0 || offset < 0) {
        // Next card
        newIndex = Math.min(cards.length - 1, newIndex + 1);
      } else {
        // Prev card
        newIndex = Math.max(0, newIndex - 1);
      }
    }

    setFocusedIndex(newIndex);
    controls.start({
      x: getXForIndex(newIndex),
      transition: { type: "spring", stiffness: 300, damping: 30 }
    });
  };

  const handleCardClick = (index: number) => {
    if (!flippedIndices.includes(index)) {
      onCardFlip(index);
    } else {
      // If clicking the already focused card, maybe toggle details? 
      // Current logic: toggle focus. 
      // But for carousel, we probably always want *some* card focused if we are in view?
      // Or maybe clicking a non-focused card centers it.
      if (focusedIndex !== index) {
        setFocusedIndex(index);
      } else {
        setFocusedIndex(null);
      }
    }
  };

  return (
    <div className="relative w-full overflow-hidden py-4" ref={containerRef}>
      {/* Fade Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-void to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-void to-transparent z-20 pointer-events-none" />

      <motion.div
        className="flex gap-4 items-center"
        animate={controls}
        drag="x"
        dragConstraints={{ 
          left: getXForIndex(cards.length - 1), 
          right: getXForIndex(0) 
        }}
        onDragEnd={handleDragEnd}
        style={{ 
          width: cards.length * (CARD_WIDTH + GAP) - GAP,
          x: getXForIndex(focusedIndex ?? 0) // Initial position
        }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={cn(
              "relative flex-shrink-0 transition-all duration-500",
              // Dim non-focused cards
              focusedIndex !== null && focusedIndex !== index ? "opacity-40 scale-95 grayscale-[0.5]" : "opacity-100 scale-100"
            )}
            style={{
              width: CARD_WIDTH,
              height: 420, // Fixed height for mobile
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-full h-full relative group">
              <Card
                card={card}
                isFlipped={flippedIndices.includes(index)}
                onClick={() => handleCardClick(index)}
                className="w-full h-full shadow-lg"
                width={undefined}
                height={undefined}
              />
              
              {/* Glow effect for unflipped */}
              {!flippedIndices.includes(index) && (
                <div className="absolute inset-0 rounded-xl bg-gold/5 animate-pulse pointer-events-none" />
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
