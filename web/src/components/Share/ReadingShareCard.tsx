"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Frame } from "@/components/ui/Frame";
import { AspectIcon } from "@/components/AspectIcon";
import { cn, prefixPath } from "@/lib/utils";
import Image from "next/image";

interface CardData {
  name: string;
  englishName: string;
  aspects: string[];
  imagePath: string;
  isReversed: boolean;
  positionName?: string;
}

interface ReadingShareCardProps {
  drawnCards: CardData[];
  spreadName: string;
  date: string;
  url?: string;
  question?: string;
  showQuestion?: boolean;
}

export function ReadingShareCard({ drawnCards, spreadName, date, url, question, showQuestion }: ReadingShareCardProps) {
  const shareUrl = url || "https://tarot-but-hours.vercel.app/?utm_source=share_image&utm_medium=reading_card";

  return (
    <Frame className="w-full bg-void p-8 flex flex-col items-center text-center gap-6 border-gold/50 min-h-[800px] justify-between">
       {/* Header */}
       <div className="w-full flex justify-between items-end border-b border-gold/20 pb-4">
          <div className="text-left">
            <h1 className="font-unifraktur text-3xl text-gold tracking-wider">Tarot of the Hours</h1>
            <p className="font-serif text-gold/60 text-xs uppercase tracking-widest mt-1">{date}</p>
          </div>
          <div className="text-right">
             <div className="text-gold/80 font-serif italic text-lg">{spreadName}</div>
          </div>
       </div>

       {/* Question (Optional) */}
       {showQuestion && question && (
         <div className="w-full bg-void-deep/50 p-6 border border-gold/10 rounded-sm my-2">
            <p className="font-serif text-primary-text/90 italic text-lg leading-relaxed">“{question}”</p>
         </div>
       )}

       {/* Cards Display */}
       <div className="flex-1 w-full flex flex-wrap justify-center content-center gap-6 py-4">
          {drawnCards.map((card, idx) => (
             <div key={idx} className="flex flex-col items-center gap-3 w-[140px]">
                {/* Card Frame */}
                <div className={cn(
                    "relative w-full aspect-[2/3] border border-gold/40 bg-black/40 flex items-center justify-center p-1 transition-transform",
                    card.isReversed && "rotate-180"
                )}>
                    <div className="relative w-full h-full overflow-hidden">
                        <Image 
                            src={prefixPath(card.imagePath)} 
                            alt={card.name}
                            fill
                            className="object-cover opacity-90"
                            sizes="140px"
                        />
                    </div>
                    {/* Corner decorations */}
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-gold/50" />
                    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-gold/50" />
                </div>
                
                {/* Label */}
                <div className="text-center space-y-1">
                    <div className="text-[10px] text-gold/50 uppercase tracking-wider">{card.positionName || `#${idx + 1}`}</div>
                    <div className="text-base text-gold font-serif leading-tight">{card.name}</div>
                    {card.isReversed && <div className="text-[10px] text-red-400/80 font-serif">(逆位)</div>}
                </div>
             </div>
          ))}
       </div>

       {/* Footer */}
       <div className="w-full pt-6 border-t border-gold/20 flex items-center justify-between">
          <div className="text-left">
             <p className="text-xs text-gold/60 font-serif">The higher I rise, the more I see.</p>
             <p className="text-[10px] text-gold/30 uppercase tracking-widest mt-1">Scan to Witness</p>
          </div>
          <div className="bg-white p-2 rounded-sm">
             <QRCodeSVG 
                value={shareUrl} 
                size={64} 
                level="M"
                fgColor="#111111"
                bgColor="#FFFFFF"
             />
          </div>
       </div>
    </Frame>
  );
}
