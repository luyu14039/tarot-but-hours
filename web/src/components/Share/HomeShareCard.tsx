"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Frame } from "@/components/ui/Frame";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";

interface HomeShareCardProps {
  quote: string;
  imagePath: string;
  aspectName: string;
  url?: string;
}

export function HomeShareCard({ quote, imagePath, aspectName, url }: HomeShareCardProps) {
  const shareUrl = url || "https://tarot-but-hours.vercel.app/?utm_source=share_image&utm_medium=home_card";

  return (
    <Frame className="w-full bg-void p-8 flex flex-col items-center text-center gap-8 border-gold/50 aspect-[3/5] justify-between">
      {/* Header */}
      <div className="space-y-2 mt-4">
        <h1 className="font-unifraktur text-4xl text-gold tracking-wider">Tarot of the Hours</h1>
        <p className="font-serif text-gold/60 text-sm uppercase tracking-[0.3em]">司辰塔罗</p>
      </div>

      {/* Centerpiece */}
      <div className="flex flex-col items-center gap-6 py-4 w-full">
        <div className="relative w-48 aspect-[2/3] flex items-center justify-center shadow-[0_0_30px_rgba(197,160,89,0.2)]">
            <Image 
              src={prefixPath(imagePath)} 
              alt={aspectName}
              fill
              className="object-cover rounded-sm border border-gold/30"
            />
        </div>
        <div className="font-serif text-2xl text-gold/90 italic border-b border-gold/30 pb-2 px-4">
            {aspectName}
        </div>
      </div>

      {/* Quote */}
      <div className="relative px-6 py-4">
        <span className="absolute top-0 left-2 text-5xl text-gold/10 font-serif leading-none">“</span>
        <p className="font-serif text-xl text-primary-text/90 leading-relaxed">
          {quote}
        </p>
        <span className="absolute bottom-0 right-2 text-5xl text-gold/10 font-serif leading-none">”</span>
      </div>

      {/* Intro Text */}
      <div className="text-gold/50 text-sm font-serif italic tracking-wide">
        基于《密教模拟器》世界观的塔罗占卜<br/>
        向司辰寻求你的答案
      </div>

      {/* Footer / QR */}
      <div className="w-full pt-6 border-t border-gold/20 flex items-center justify-between mb-2">
        <div className="text-left">
            <p className="text-[10px] text-gold/40 uppercase tracking-widest mb-1">Scan to Enter</p>
            <p className="text-xs text-gold/60 font-serif">漫宿没有墙垣。</p>
        </div>
        <div className="bg-white p-1.5 rounded-sm">
            <QRCodeSVG 
                value={shareUrl} 
                size={72} 
                level="M"
                fgColor="#111111"
                bgColor="#FFFFFF"
            />
        </div>
      </div>
    </Frame>
  );
}
