"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, SpreadType } from "@/store/useStore";
import { Particles } from "@/components/Particles";
import { Frame } from "@/components/ui/Frame";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Sparkles, Eye, Layers, LayoutGrid, ArrowRight, Settings, X, Github, ExternalLink, Monitor, ChevronDown } from "lucide-react";
import { FontDebug } from "@/components/FontDebug";

const quotes = [
  "飞蛾总是飞向光，但光总是烧死飞蛾。",
  "有些知识一旦入眼，便无法被遗忘。",
  "伤口是世界的裂隙。",
  "历史有许多重，而我们只记得其中一重。",
  "不要接受制花人的礼物。",
  "只有在绝对的黑暗中，颜色才拥有触感。",
  "结局总是美丽的，只要你接受它的到来。",
];

const titles = [
  { zh: "格里比的谜语", en: "Griby's Enigmas" },
  { zh: "可悲的疯言", en: "Wretched Ravings" },
  { zh: "噤声的低语", en: "Hushed Whispers" },
  { zh: "虚构的真理", en: "Fictional Truths" },
];

const spreadOptions: { id: SpreadType; name: string; icon: any }[] = [
  { id: "single", name: "道路：林地", icon: Eye },
  { id: "three", name: "漫宿的浩旅", icon: Layers },
  { id: "five", name: "残破十字路", icon: LayoutGrid },
];

const otherProjects = [
  {
    name: "漫宿回响",
    enName: "Which Hour Will You Serve",
    desc: "寻觅你命定的司辰。基于《密教模拟器》世界观的沉浸式互动心理测试，由 DeepSeek-R1 驱动的 AI 命运书写。",
    repo: "https://github.com/luyu14039/Which-hour-will-you-serve",
    demo: "https://luyu14039.github.io/Which-hour-will-you-serve/",
    tags: ["心理测试", "AI 小说"]
  },
  {
    name: "苍白卷宗",
    enName: "Pale Notes",
    desc: "由 DeepSeek R1 驱动的文本 RPG。作为防剿局探员，在 1900 年代的伦敦迷雾中揭开不可名状的秘密。",
    repo: "https://github.com/luyu14039/pale-notes",
    demo: "https://luyu14039.github.io/pale-notes/",
    tags: ["文字 RPG", "无限叙事"]
  },
  {
    name: "噤声书屋",
    enName: "Hush House",
    desc: "基于 LLM 数据提炼的《密教模拟器》与《司辰之书》沉浸式可视化阅读器与知识图谱构建项目。",
    repo: "https://github.com/luyu14039/Hush-House",
    demo: "https://luyu14039.github.io/Hush-House/",
    tags: ["知识图谱", "可视化阅读"],
    pcOnly: true
  }
];

export default function Home() {
  const router = useRouter();
  const { setQuestion, setSelectedSpread, apiKey, setApiKey } = useStore();
  const [input, setInput] = useState("");
  const [localSpread, setLocalSpread] = useState<SpreadType>("single");
  const [quote, setQuote] = useState("");
  const [title, setTitle] = useState(titles[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setTitle(titles[Math.floor(Math.random() * titles.length)]);
    setTempKey(apiKey);

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [apiKey]);

  const handleSaveSettings = () => {
    setApiKey(tempKey);
    setShowSettings(false);
  };

  const handleStart = () => {
    if (!input.trim()) return;
    setQuestion(input);
    setSelectedSpread(localSpread);
    router.push("/spread");
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center py-20 overflow-x-hidden bg-void text-primary-text selection:bg-gold selection:text-void font-serif">
      <FontDebug />
      <Particles />
      
      {/* Header Section */}
      <header className="z-20 w-full flex flex-col items-center mb-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center relative flex flex-col items-center"
        >
          <div className="absolute inset-0 blur-2xl bg-gold/10 rounded-full opacity-50" />
          <h1 className="relative text-5xl md:text-7xl font-serif text-gold tracking-[0.15em] mb-4 drop-shadow-[0_0_15px_rgba(197,160,89,0.5)] select-none">
            {title.zh}
          </h1>
          <p className="relative text-gold-dim text-lg md:text-xl tracking-[0.2em] font-gothic opacity-80 mix-blend-plus-lighter mb-6">
            {title.en}
          </p>
          
          <Button
            variant="ghost"
            size="sm"
            className="relative text-gold/40 hover:text-gold hover:bg-gold/5 transition-all duration-300 border border-transparent hover:border-gold/20 hidden"
            onClick={() => setShowSettings(true)}
          >
            <Settings size={14} className="mr-2" />
            <span className="tracking-widest text-xs">配置仪式密钥 (API Key)</span>
          </Button>
        </motion.div>
      </header>

      {/* Main Interaction Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="z-20 w-full max-w-xl px-6"
      >
        <Frame className="p-8 md:p-12 bg-void-deep/80 backdrop-blur-sm shadow-2xl border-gold/40">
          
          {/* 1. Input Question */}
          <div className="mb-10 text-center">
            <label className="block text-gold/60 text-xs uppercase tracking-widest mb-4">
              在此刻下你的疑问
            </label>
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="..."
                className="w-full bg-transparent border-b border-gold/30 text-center text-xl md:text-2xl py-3 text-gold placeholder-gold/10 focus:outline-none focus:border-gold transition-colors font-serif"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
              />
              <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gold group-hover:w-full group-focus-within:w-full transition-all duration-500 -translate-x-1/2" />
            </div>
          </div>

          {/* 2. Select Spread */}
          <div className="mb-12">
            <label className="block text-gold/60 text-xs uppercase tracking-widest mb-6 text-center">
              选择仪式的形状
            </label>
            <div className="flex justify-center gap-4 md:gap-6">
              {spreadOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = localSpread === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setLocalSpread(option.id)}
                    className={cn(
                      "cursor-pointer flex flex-col items-center gap-3 p-4 rounded-lg border transition-all duration-300 w-24 md:w-28",
                      isSelected 
                        ? "border-gold bg-gold/10 text-gold shadow-[0_0_10px_rgba(197,160,89,0.2)]" 
                        : "border-gold/20 text-gold/40 hover:border-gold/50 hover:text-gold/80"
                    )}
                  >
                    <Icon size={24} strokeWidth={1.5} />
                    <span className="text-xs tracking-widest">{option.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Confirm Button */}
          <div className="flex justify-center mb-8">
            <Button 
              onClick={handleStart} 
              disabled={!input} 
              className="w-full md:w-auto min-w-[200px] group"
              size="lg"
            >
              <span className="flex items-center gap-3">
                <Sparkles size={16} className="text-gold/50 group-hover:text-gold transition-colors" />
                <span>揭示命运</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>

          {/* 4. API Key Config */}
          <div className="border-t border-gold/10 pt-6 mt-2">
            <div 
              className="bg-gold/5 border border-gold/10 rounded-lg p-4 flex flex-col items-center gap-3 cursor-pointer hover:bg-gold/10 transition-colors group"
              onClick={() => setShowSettings(true)}
            >
              <div className="flex items-center gap-2 text-gold/60 group-hover:text-gold transition-colors">
                <Settings size={16} />
                <span className="text-xs tracking-widest uppercase font-serif">配置仪式密钥</span>
              </div>
              <p className="text-[10px] text-gold-dim/60 text-center leading-relaxed max-w-xs">
                建议使用自己的 API Key 以获得更稳定的体验<br/>公用 API Key 额度有限
              </p>
            </div>
          </div>

        </Frame>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="w-full max-w-md px-6 pointer-events-auto">
                <Frame className="bg-void-deep border-gold/40 p-8 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gold font-serif text-xl">设置</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                      <X size={20} className="text-gold/50 hover:text-gold" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-gold-dim text-xs uppercase tracking-widest mb-2">
                        OpenAI API Key
                      </label>
                      <input
                        type="password"
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-black/30 border border-gold/20 rounded p-3 text-gold placeholder-gold/10 focus:outline-none focus:border-gold/50 transition-colors font-mono text-sm"
                      />
                      <p className="text-xs text-gold/40 mt-2 leading-relaxed">
                        建议使用您自己的 API Key 以获得更稳定的体验。公用 Key 额度有限。
                        您的 Key 仅存储在本地浏览器中。
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings}>
                      保存设置
                    </Button>
                  </div>
                </Frame>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. Hour's Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="z-20 mt-8 mb-24 text-center px-6"
      >
        <p className="text-gold/40 text-sm md:text-base font-serif italic tracking-wide max-w-lg mx-auto leading-relaxed">
          “{quote}”
        </p>
      </motion.div>

      {/* Scroll Hint - Fixed at bottom */}
      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="text-[10px] text-gold tracking-[0.3em] font-serif drop-shadow-[0_0_5px_rgba(197,160,89,0.5)]">
              向下探索
            </span>
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={20} className="text-gold drop-shadow-[0_0_5px_rgba(197,160,89,0.5)]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Other Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="z-20 w-full max-w-5xl px-6 mb-20"
      >
        <div className="flex items-center justify-center gap-4 mb-8 opacity-50">
          <div className="h-[1px] w-12 bg-gold/30" />
          <span className="text-gold/40 text-xs uppercase tracking-[0.2em]">More from the Mansus</span>
          <div className="h-[1px] w-12 bg-gold/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherProjects.map((project, index) => (
            <div
              key={index}
              className="group relative block h-full"
            >
              <Frame className="h-full p-6 bg-void-deep/40 hover:bg-void-deep/60 transition-colors border-gold/10 hover:border-gold/30 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-gold font-serif text-lg group-hover:text-gold-light transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-[10px] text-gold-dim uppercase tracking-wider opacity-60">
                      {project.enName}
                    </p>
                  </div>
                  {project.pcOnly && (
                    <div className="bg-gold/10 px-2 py-1 rounded text-[10px] text-gold/60 flex items-center gap-1" title="PC Only">
                      <Monitor size={10} />
                      <span className="hidden sm:inline">PC</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gold/60 text-xs leading-relaxed mb-6 flex-grow line-clamp-3">
                  {project.desc}
                </p>

                <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gold/5">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[9px] text-gold/30 border border-gold/10 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[10px]">
                    <a 
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gold/40 hover:text-gold transition-colors px-2 py-1 rounded hover:bg-gold/5"
                    >
                      <Github size={12} />
                      <span>仓库链接</span>
                    </a>
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gold/60 hover:text-gold transition-colors px-2 py-1 rounded hover:bg-gold/5 border border-gold/10 hover:border-gold/30"
                    >
                      <ExternalLink size={12} />
                      <span>在线访问</span>
                    </a>
                  </div>
                </div>
              </Frame>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
