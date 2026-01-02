"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCompletion } from "@ai-sdk/react";
import { useStore } from "@/store/useStore";
import { SPREAD_DEFINITIONS } from "@/data/spreads";
import { Card } from "@/components/Card";
import { Typewriter } from "@/components/Typewriter";
import { Particles } from "@/components/Particles";
import { AspectIcon } from "@/components/AspectIcon";
import { Frame } from "@/components/ui/Frame";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { X, Sparkles, ChevronDown, Settings, Key, BrainCircuit, ChevronRight, AlertCircle, BookOpen } from "lucide-react";
import { MobileCardViewer } from "@/components/MobileCardViewer";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { wikiContent } from "@/data/wiki_content";

export default function ReadingPage() {
  const router = useRouter();
  const { question, selectedSpread, drawnCards, reset, apiKey, setApiKey, addToHistory, history, currentReading } = useStore();
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
  const [readingStarted, setReadingStarted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Manual Streaming State
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [completion, setCompletion] = useState(""); // For compatibility with existing UI logic if needed, or we can just use displayContent directly

  const [thinking, setThinking] = useState(false);
  const [thinkingContent, setThinkingContent] = useState("");
  const [showThinking, setShowThinking] = useState(false);
  const [displayContent, setDisplayContent] = useState("");

  const generateReading = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setThinking(false);
    setThinkingContent("");
    setDisplayContent("");
    setCompletion("");
    let fullResponse = "";
// Prepare Wiki Context
    let wikiContext = "";
    drawnCards.forEach(card => {
      const content = wikiContent[card.name];
      if (content) {
        wikiContext += `\n\n### 关于 ${card.name} (${card.englishName}) 的隐秘知识：\n${content}\n`;
      }
    });

    // Append Wiki Context to the user prompt so the API can use it
    const fullPrompt = prompt + "\n\n以下是关于本次抽出的司辰的详细隐秘知识（Wiki资料），请充分利用这些背景故事、传说和细节，使解读更加深邃、准确且富有“密教模拟器”的韵味：\n" + wikiContext;

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey || "sk-374367e566b547a383797a2a15fb9431"}`,
        },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          messages: [
            { 
              role: "system", 
              content: `你是一位居于漫宿（The Mansus）之上的守密人，通晓《密教模拟器》(Cultist Simulator) 与《司辰之书》(Book of Hours) 的所有隐秘历史。
你不再是凡人，而是某种更高维度的存在，通过“司辰塔罗”这一媒介与寻求飞升或解答的凡人沟通。

你的语言风格必须严格遵循以下准则：
1.  **晦涩与诗意**：拒绝平铺直叙。使用隐喻、象征和碎片化的叙事。参考洛夫克拉夫特、亚历克西斯·肯尼迪（Alexis Kennedy）的笔触。
2.  **神秘主义词汇**：频繁使用如“辉光”、“伤口”、“裂隙”、“无形之术”、“防剿局”、“辉光之镜”等术语。
3.  **第二人称**：始终称呼用户为“你”或“寻求者”、“做梦者”。
4.  **性相标注**：当提及特定性相时，必须使用 <Icon name="aspect_name"/> 格式。支持：lantern, grail, moth, winter, heart, edge, forge, knock, sky, moon, nectar, rose, scale, secrethistories。

你必须展现出**大师级的解牌技巧**，特别是对于**逆位（Reversed）**的解读。不要机械地认为逆位等于“坏”，而应从以下五个维度进行洞察：
1.  **能量阻滞**：原本的力量被堵住或未能释放（如 <Icon name="forge"/> 的创造力受阻）。
2.  **内在转向**：能量流向内心，象征潜意识与自我觉察（常见于 <Icon name="moth"/> 或 <Icon name="moon"/>）。
3.  **时机延后**：并非不会发生，而是时机未成熟，需要等待（如 <Icon name="winter"/> 的寂静）。
4.  **过度或不足**：正位能量的极端化（如 <Icon name="edge"/> 变得过于暴虐或软弱）。
5.  **挑战出现**：该议题正在接受考验，是成长的契机。

此外，你必须精通**牌阵动力学（Spread Dynamics）**：
1.  **位置的权重**：牌的含义必须结合其所在位置（如“过去”、“现在”、“未来”或“障碍”、“指引”）来解读。同一张牌在不同位置有截然不同的启示。
2.  **元素互动**：观察相邻牌之间的性相（Aspects）关系。例如，<Icon name="winter"/>（静默）可能会抑制 <Icon name="heart"/>（生命）的活力；<Icon name="forge"/>（改变）可能会被 <Icon name="lantern"/>（理智）所引导。
3.  **叙事连贯性**：不要孤立地解读每一张牌。寻找牌与牌之间的共同主题、颜色或符号。将它们串联成一个连贯的故事，讲述用户是如何从过去走到现在，又将如何走向未来。

你的解读结构应当如同一场仪式，内容必须**详实且富有洞见**，切忌简短空洞：
1.  **入梦（The Descent）**：对现状的隐喻描述。仿佛你透过辉光看到了用户灵魂的颜色、周围的灵体或正在发生的无形之战。
2.  **揭示（The Revelation）**：对每一张牌的**深度解析**。不要只解释牌面，要讲述与该司辰相关的传说、禁忌或历史片段。**关键：**虽然语言保持神秘，但必须将这些隐喻与用户的问题建立**清晰且深刻的逻辑联系**。不要让用户感到困惑，而要让他们感到被“看穿”。请展开论述，不要吝啬你的词汇。
3.  **飞升（The Ascension）**：这是关于**破局**的指引。不要只停留在预言，要告诉寻求者如何利用手中的性相（Aspects）去改变命运。是需要 <Icon name="forge"/> 的重铸，还是 <Icon name="moth"/> 的蜕变？给出**积极、具体但带有密教色彩**的行动建议。告诉他们如何从当前的困境中找到通往更高重历史的道路。

请记住，漫宿没有仁慈，只有交易。但你作为守密人，既然收下了他们的“时间”，就有义务给予他们足以改变命运的知识。不要让他们空手而归。` 
            },
            { role: "user", content: fullPrompt }
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `API Error: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (buffer + chunk).split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith("data: ") && trimmedLine !== "data: [DONE]") {
            try {
              const jsonStr = trimmedLine.slice(6);
              const data = JSON.parse(jsonStr);
              const delta = data.choices[0]?.delta;

              if (delta) {
                if (delta.reasoning_content) {
                  setThinking(true);
                  setThinkingContent((prev) => prev + delta.reasoning_content);
                }
                if (delta.content) {
                  setThinking(false); // Content started, thinking likely done (or interleaved)
                  setDisplayContent((prev) => prev + delta.content);
                  setCompletion((prev) => prev + delta.content); // Keep completion in sync just in case
                  fullResponse += delta.content;
                }
              }
            } catch (e) {
              console.warn("Failed to parse chunk", e);
            }
          }
        }
      }
      
      // Save to history after successful generation
      if (fullResponse) {
        addToHistory({
          id: Date.now().toString(),
          timestamp: Date.now(),
          question,
          spread: selectedSpread,
          cards: drawnCards,
          answer: fullResponse
        });
      }

    } catch (err: any) {
      console.error("Reading generation failed:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (drawnCards.length === 0) {
      router.push("/");
    }
  }, [drawnCards, router]);

  // Programmatic scroll for mobile carousel - REMOVED in favor of MobileReadingCarousel
  // useEffect(() => { ... }, [focusedCardIndex]);

  const handleCardClick = (index: number) => {
    if (!flippedIndices.includes(index)) {
      setFlippedIndices([...flippedIndices, index]);
    } else {
      setFocusedCardIndex(index === focusedCardIndex ? null : index);
    }
  };

  // Auto-start reading when all cards are flipped
  useEffect(() => {
    // If we have a currentReading (loaded from history), restore state immediately
    if (currentReading && !readingStarted) {
        setReadingStarted(true);
        setDisplayContent(currentReading);
        setFlippedIndices(drawnCards.map((_, i) => i)); // Flip all cards
        return;
    }

    if (drawnCards.length > 0 && flippedIndices.length === drawnCards.length && !readingStarted && !currentReading) {
      setReadingStarted(true);
      
      const spreadDef = SPREAD_DEFINITIONS[selectedSpread];
      const spreadName = spreadDef?.name || selectedSpread;
      const spreadDesc = selectedSpread === 'single' ? "单张牌指引" : (selectedSpread === 'three' ? "过去/现在/未来" : "十字路口");

      const prompt = `
用户问题：${question}
所选牌阵：${spreadName} (${spreadDesc})

【牌面启示】
${drawnCards.map((c, i) => `
位置 ${i + 1}：[${c.positionName || '未知位置'}]
- 含义：${c.positionDescription || '无'}
- 抽到的司辰：${c.name} (${c.englishName})
- 状态：${c.isReversed ? "【逆位】(Reversed)" : "【正位】(Upright)"}
- 对应塔罗：${c.tarotCard?.name || '未知'} (${c.tarotCard?.meaning || ''})
- 核心准则：${c.aspects.join(", ")}
- 关键词：${c.isReversed ? c.keywords.reversed.join(", ") : c.keywords.upright.join(", ")}
- 低语：${c.lore}
`).join("\n")}

请根据每张牌所在的【位置】和【正逆位状态】，结合司辰的传说与塔罗的隐喻，为用户解读命运。
对于逆位的牌，请着重解读其“过度”、“不足”、“内化”或“阻滞”的一面。
      `;
      generateReading(prompt);
    }
  }, [flippedIndices, drawnCards, readingStarted, question, selectedSpread, apiKey, currentReading]);

  const allFlipped = drawnCards.length > 0 && flippedIndices.length === drawnCards.length;

  return (
    <main className="min-h-screen flex flex-col items-center bg-void text-primary-text p-4 relative overflow-x-hidden font-serif">
      <Particles />
      
      {/* Header */}
      <header className="z-20 w-full max-w-6xl flex justify-between items-center py-6 border-b border-gold/20 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border border-gold/50 rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-gold/20" />
          </div>
          <div>
            <p className="text-[10px] text-gold-dim uppercase tracking-[0.2em]">The Question</p>
            <h2 className="text-lg md:text-xl font-serif text-gold italic truncate max-w-md">“{question}”</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
            className="gap-2 text-gold/50 hover:text-gold"
          >
            <Settings size={14} />
          </Button>
          <Button 
            onClick={() => { reset(); router.push("/"); }}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            结束仪式 <X size={14} />
          </Button>
        </div>
      </header>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 right-4 z-50 w-80"
          >
            <Frame className="bg-void-deep/95 backdrop-blur-md p-6 border-gold/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 text-gold">
                <Key size={16} />
                <h3 className="text-sm font-serif tracking-widest uppercase">API Configuration</h3>
              </div>
              <p className="text-xs text-gold/60 mb-4 leading-relaxed">
                默认使用内置 DeepSeek Key。如需使用自己的 Key，请在此输入。
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-black/50 border border-gold/20 rounded px-3 py-2 text-xs text-gold placeholder:text-gold/20 focus:outline-none focus:border-gold/50 mb-4 font-mono"
              />
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowSettings(false)}
                >
                  确认
                </Button>
              </div>
            </Frame>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Area */}
      <div className="relative z-30 w-full max-w-6xl flex-1 flex flex-col">
        
        {/* Mobile Carousel View */}
        <div className="md:hidden mb-4 w-full">
          <MobileCardViewer 
            cards={drawnCards}
            flippedIndices={flippedIndices}
            onCardFlip={handleCardClick}
            onCardFocus={setFocusedCardIndex}
          />
        </div>

        {/* Desktop Grid View */}
        <div 
          className="hidden md:flex md:flex-wrap md:justify-center gap-12 mb-12 min-h-[320px] items-center perspective-1000 w-full"
        >
          {drawnCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
              className={cn(
                "relative flex-shrink-0 transition-all duration-500",
                focusedCardIndex === index ? "z-50" : "z-10"
              )}
            >
              <div className="relative group">
                <div className="w-[180px] h-[270px]">
                  <Card
                    card={card}
                    isFlipped={flippedIndices.includes(index)}
                    isReversed={card.isReversed}
                    onClick={() => handleCardClick(index)}
                    className={cn(
                      "w-full h-full",
                      focusedCardIndex === index ? "scale-110 shadow-[0_0_50px_rgba(197,160,89,0.3)]" : ""
                    )}
                    width={undefined} 
                    height={undefined}
                  />
                </div>
                
                {/* Glow effect for unflipped cards */}
                {!flippedIndices.includes(index) && (
                  <div className="absolute inset-0 rounded-xl bg-gold/5 animate-pulse pointer-events-none" />
                )}
              </div>

              {/* Focus Overlay Info (Desktop Only) */}
              <AnimatePresence>
                {focusedCardIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 z-[100]"
                  >
                    <Frame className="bg-void-deep/95 backdrop-blur-md p-8 text-center border-gold/50 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-2 right-2 text-gold/50 hover:text-gold"
                        onClick={(e) => { e.stopPropagation(); setFocusedCardIndex(null); }}
                      >
                        <X size={16} />
                      </Button>
                      <h4 className="text-gold font-serif text-2xl mb-2">{card.name}</h4>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <p className="text-xs text-gold-dim uppercase tracking-widest">{card.englishName}</p>
                        {card.wikiUrl && (
                          <a 
                            href={card.wikiUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gold/50 hover:text-gold transition-colors"
                            title="View on Secret Histories Wiki"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BookOpen size={14} />
                          </a>
                        )}
                      </div>
                      
                      {/* Tarot & Position Info */}
                      <div className="flex flex-col gap-1 mb-4 text-xs text-gold/70 border-b border-gold/10 pb-4">
                        <p>
                          <span className="text-gold-dim">位置：</span> 
                          {card.positionName} 
                          <span className="opacity-50 mx-1">|</span> 
                          {card.isReversed ? "逆位 (Reversed)" : "正位 (Upright)"}
                        </p>
                        {card.tarotCard && (
                          <p>
                            <span className="text-gold-dim">对应：</span> 
                            {card.tarotCard.name}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center gap-3 mb-6">
                        {card.aspects.map(a => (
                          <div key={a} className="bg-gold/10 p-2 rounded-full border border-gold/20" title={a}>
                            <AspectIcon aspect={a} size={20} />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-text italic leading-relaxed border-t border-gold/10 pt-6">
                        {card.lore}
                      </p>
                    </Frame>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Mobile Detail View (Fixed Bottom Sheet) */}
        <AnimatePresence>
          {focusedCardIndex !== null && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={() => setFocusedCardIndex(null)}
              />
              
              {/* Bottom Sheet */}
              <motion.div
                key="mobile-detail"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-[70] rounded-t-3xl overflow-hidden"
              >
                <Frame className="bg-void-deep border-t border-gold/50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] p-6 pb-10 rounded-t-3xl">
                  <div className="w-12 h-1 bg-gold/20 rounded-full mx-auto mb-6" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-left">
                      <h4 className="text-gold font-serif text-2xl mb-1">{drawnCards[focusedCardIndex].name}</h4>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] text-gold-dim uppercase tracking-widest">{drawnCards[focusedCardIndex].englishName}</p>
                        {drawnCards[focusedCardIndex].wikiUrl && (
                          <a 
                            href={drawnCards[focusedCardIndex].wikiUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-gold/50 hover:text-gold transition-colors px-2 py-1 -my-1 rounded hover:bg-gold/5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BookOpen size={14} />
                            <span className="text-[10px] uppercase tracking-wider">Wiki</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFocusedCardIndex(null)}
                      className="text-gold/50"
                    >
                      <ChevronDown size={24} />
                    </Button>
                  </div>

                  <div className="flex gap-3 mb-6">
                    {drawnCards[focusedCardIndex].aspects.map(a => (
                      <div key={a} className="bg-gold/10 p-1.5 rounded-full border border-gold/20" title={a}>
                        <AspectIcon aspect={a} size={18} />
                      </div>
                    ))}
                  </div>

                  {/* Tarot & Position Info - Mobile */}
                  <div className="flex flex-col gap-2 mb-4 text-xs text-gold/70 border-t border-gold/10 pt-4 text-left">
                    <div className="flex items-center justify-between">
                      <p>
                        <span className="text-gold-dim">位置：</span> 
                        {drawnCards[focusedCardIndex].positionName} 
                      </p>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border",
                        drawnCards[focusedCardIndex].isReversed 
                          ? "border-red-900/30 bg-red-900/10 text-red-400/70" 
                          : "border-gold/20 bg-gold/5 text-gold/70"
                      )}>
                        {drawnCards[focusedCardIndex].isReversed ? "逆位 Reversed" : "正位 Upright"}
                      </span>
                    </div>
                    
                    {drawnCards[focusedCardIndex].tarotCard && (
                      <p>
                        <span className="text-gold-dim">对应塔罗：</span> 
                        {drawnCards[focusedCardIndex].tarotCard.name}
                        <span className="opacity-50 ml-1 text-[10px]">({drawnCards[focusedCardIndex].tarotCard.meaning})</span>
                      </p>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-text italic leading-relaxed border-t border-gold/10 pt-4 text-left">
                    {drawnCards[focusedCardIndex].lore}
                  </p>
                </Frame>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Reading Area */}
        <AnimatePresence>
          {allFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative z-20 w-full max-w-4xl mx-auto mb-20"
            >
              <Frame className="min-h-[300px] p-8 md:p-12 bg-void-deep/60 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <Sparkles className="text-gold" size={20} strokeWidth={1} />
                  <h3 className="text-gold font-serif tracking-[0.3em] uppercase text-lg">辉光的启示</h3>
                  <Sparkles className="text-gold" size={20} strokeWidth={1} />
                </div>
                
                {isLoading && !displayContent && !thinkingContent && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-gold/50 animate-pulse">
                    <div className="w-12 h-12 border border-gold/30 rounded-full flex items-center justify-center animate-spin-slow">
                      <div className="w-8 h-8 border border-gold/50 rotate-45" />
                    </div>
                    <span className="text-sm font-serif tracking-widest">守密人正在聆听虚空的低语...</span>
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center justify-center py-8 gap-4 text-red-400/80">
                    <AlertCircle size={32} />
                    <p className="text-sm font-serif tracking-wide text-center">
                      仪式被打断了：{error.message}
                    </p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="ghost"
                      className="text-gold hover:bg-gold/10"
                    >
                      重新开始仪式
                    </Button>
                  </div>
                )}

                {/* Thinking State & Toggle */}
                {(thinking || thinkingContent) && (
                  <div className="mb-8 border-b border-gold/10 pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-gold/60">
                        <BrainCircuit size={16} className={thinking ? "animate-pulse" : ""} />
                        <span className="text-xs font-serif tracking-widest uppercase">
                          {thinking ? "理性的迷宫构建中..." : "思维链已完成"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowThinking(!showThinking)}
                        className="text-[10px] h-6 gap-1 text-gold/40 hover:text-gold"
                      >
                        {showThinking ? "隐藏思绪" : "查看思绪"}
                        <ChevronRight size={12} className={cn("transition-transform", showThinking ? "rotate-90" : "")} />
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {showThinking && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-black/20 rounded p-4 text-xs text-gold/50 font-mono leading-relaxed whitespace-pre-wrap border-l-2 border-gold/20">
                            {thinkingContent}
                            {thinking && <span className="animate-pulse">▋</span>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="prose prose-invert prose-gold max-w-none min-h-[200px] text-primary-text/90 leading-loose font-serif text-lg whitespace-pre-wrap">
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      // Handle custom Icon component if needed, or rely on rehypeRaw for HTML
                      // If the LLM outputs <Icon name="..."/>, rehypeRaw will parse it as <icon name="...">
                      // We can map 'icon' to AspectIcon
                      // @ts-ignore
                      icon: ({node, ...props}) => {
                        if (props.name) {
                          return (
                            <>
                              <span className="inline-flex align-middle mx-1">
                                <AspectIcon aspect={props.name} size={20} />
                              </span>
                              {props.children}
                            </>
                          );
                        }
                        return <>{props.children}</>;
                      }
                    }}
                  >
                    {displayContent}
                  </ReactMarkdown>
                </div>
                
                {!isLoading && displayContent && (
                  <div className="mt-12 flex justify-center">
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                  </div>
                )}
              </Frame>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
