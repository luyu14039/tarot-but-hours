"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, SpreadType, DrawnCard } from "@/store/useStore";
import { SPREAD_DEFINITIONS } from "@/data/spreads";
import { hoursData } from "@/data/hours";
import { shuffle } from "@/lib/shuffle";
import { Particles } from "@/components/Particles";
import { Frame } from "@/components/ui/Frame";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Eye, Layers, LayoutGrid, ArrowRight, ArrowLeft } from "lucide-react";

const spreads: { id: SpreadType; name: string; desc: string; icon: any }[] = [
  { 
    id: "single", 
    name: "道路：林地", 
    desc: "适合每日指引或简单的二元问题。",
    icon: Eye
  },
  { 
    id: "three", 
    name: "漫宿的浩旅", 
    desc: "过去（雄鹿之门） / 现在（蜘蛛之门） / 未来（孔雀之门）。",
    icon: Layers
  },
  { 
    id: "five", 
    name: "残破十字路", 
    desc: "核心现状 / 阻碍 / 潜在影响 / 建议 / 最终结果。",
    icon: LayoutGrid
  },
];

export default function SpreadPage() {
  const router = useRouter();
  const { question, selectedSpread, setSelectedSpread, setDrawnCards } = useStore();
  const [isShuffling, setIsShuffling] = useState(false);
  const [cardsReady, setCardsReady] = useState(false);

  useEffect(() => {
    if (!question) {
      router.push("/");
    }
  }, [question, router]);

  const handleShuffle = () => {
    setIsShuffling(true);
    // Simulate shuffle time
    setTimeout(() => {
      setIsShuffling(false);
      setCardsReady(true);
    }, 2000);
  };

  const handleDraw = () => {
    const shuffled = shuffle(hoursData);
    const spreadDef = SPREAD_DEFINITIONS[selectedSpread];
    const count = spreadDef.positions.length;
    
    const selectedCards = shuffled.slice(0, count);
    
    const drawn: DrawnCard[] = selectedCards.map((card, index) => {
      const isReversed = Math.random() < 0.5;
      const position = spreadDef.positions[index];
      
      return {
        ...card,
        isReversed,
        positionName: position.name,
        positionDescription: position.description
      };
    });

    setDrawnCards(drawn);
    router.push("/reading");
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-void text-primary-text p-6 relative overflow-hidden font-serif">
      <Particles />
      
      {/* Header */}
      <header className="z-20 w-full flex flex-col items-center pt-8 pb-8 relative">
        <Button 
          variant="ghost" 
          className="absolute left-0 top-8 text-gold/50 hover:text-gold"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="mr-2" size={20} />
          <span className="hidden md:inline">返回首页</span>
        </Button>
        <p className="text-gold-dim text-xs tracking-[0.3em] uppercase mb-2">
          The Ritual Begins
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-gold tracking-widest drop-shadow-lg text-center">
          仪式准备
        </h1>
      </header>

      {/* Question Display */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-20 w-full max-w-2xl mb-8"
      >
        <Frame className="text-center py-6 px-8">
          <p className="text-muted-text text-xs uppercase tracking-widest mb-2">你的疑问</p>
          <h2 className="text-xl md:text-2xl font-serif text-gold italic">“{question}”</h2>
        </Frame>
      </motion.div>

      {/* Spread Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="z-20 w-full max-w-2xl mb-12"
      >
        <div className="text-center space-y-4">
          <h3 className="text-gold font-serif text-lg tracking-widest border-b border-gold/20 pb-2 inline-block px-8">
            {SPREAD_DEFINITIONS[selectedSpread].name}
          </h3>
          <p className="text-gold/80 text-sm leading-relaxed max-w-lg mx-auto">
            {/* @ts-ignore */}
            {SPREAD_DEFINITIONS[selectedSpread].intro}
          </p>
          <div className="bg-gold/5 p-4 rounded-lg border border-gold/10 max-w-lg mx-auto">
            <p className="text-gold-dim text-xs uppercase tracking-widest mb-1">适用场景</p>
            <p className="text-gold/70 text-xs">
              {/* @ts-ignore */}
              {SPREAD_DEFINITIONS[selectedSpread].usage}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="z-20 w-full max-w-5xl flex-1 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {!cardsReady ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              <h3 className="text-gold/60 uppercase tracking-widest mb-8 text-sm">确认仪式 · Confirm Ritual</h3>
              
              <div className="w-full flex justify-center mb-12">
                {spreads.filter(s => s.id === selectedSpread).map((spread) => {
                  const Icon = spread.icon;
                  return (
                    <Frame 
                      key={spread.id}
                      className="flex flex-col items-center text-center p-8 border-gold bg-void-deep/80 shadow-[0_0_15px_rgba(197,160,89,0.15)] max-w-md w-full"
                    >
                      <div className="mb-6 text-gold">
                        <Icon size={48} strokeWidth={1} />
                      </div>
                      <h4 className="font-serif text-2xl mb-2 tracking-wide text-gold">
                        {spread.name}
                      </h4>
                      <p className="text-sm text-muted-text/80 leading-relaxed">
                        {spread.desc}
                      </p>
                    </Frame>
                  );
                })}
              </div>

              <Button 
                onClick={handleShuffle}
                disabled={isShuffling}
                size="lg"
                className="min-w-[200px]"
              >
                {isShuffling ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse">洗牌中...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    注入意念 <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </motion.div>
          ) : (
            /* Draw Phase */
            <motion.div 
              key="draw"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div 
                className="relative w-64 h-96 cursor-pointer group perspective-1000" 
                onClick={handleDraw}
              >
                {/* Deck Visual */}
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ y: 0, x: 0 }}
                    animate={{ 
                      y: i * -2, 
                      x: i * 2,
                    }}
                    className="absolute inset-0 rounded-xl border border-gold/40 bg-void-deep shadow-2xl"
                    style={{ 
                      zIndex: 5 - i,
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* Card Back Pattern */}
                    <div className="absolute inset-2 border border-gold/20 opacity-50 rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="w-16 h-16 border border-gold rotate-45" />
                    </div>
                  </motion.div>
                ))}
                
                {/* Hover Effect */}
                <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-void-deep/90 border border-gold px-6 py-3 backdrop-blur-sm">
                    <span className="text-gold font-serif tracking-widest uppercase text-sm">
                      抽取命运
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="mt-12 text-gold-dim text-sm tracking-widest animate-pulse">
                牌堆已洗净。点击抽取你的司辰。
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
