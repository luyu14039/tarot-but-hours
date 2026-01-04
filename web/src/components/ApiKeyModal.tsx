"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Frame } from "@/components/ui/Frame";
import { Button } from "@/components/ui/Button";
import { Key, AlertCircle, Copy, Check } from "lucide-react";
import { useStore } from "@/store/useStore";

export function ApiKeyModal() {
  const { apiKey, setApiKey } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [hasSkipped, setHasSkipped] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no API key and haven't skipped yet, show modal
    if (!apiKey && !hasSkipped) {
      setIsOpen(true);
    }
  }, [apiKey, hasSkipped]);

  const handleSave = async () => {
    if (!tempKey.trim()) return;
    
    setIsValidating(true);
    setError(null);

    try {
      // 简单的验证请求，尝试获取模型列表
      const response = await fetch("https://api.deepseek.com/models", {
        headers: {
          "Authorization": `Bearer ${tempKey.trim()}`
        }
      });

      if (response.ok) {
        setApiKey(tempKey.trim());
        setIsOpen(false);
      } else {
        setError("API Key 无效，请检查后重试");
      }
    } catch (err) {
      setError("验证失败，请检查网络连接");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSkip = () => {
    setHasSkipped(true);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4"
          >
            <div className="w-full max-w-md pointer-events-auto">
              <Frame className="bg-void-deep border-gold/40 p-8 shadow-2xl">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4 border border-gold/30">
                    <Key className="text-gold w-6 h-6" />
                  </div>
                  <h3 className="text-gold font-serif text-xl mb-2">配置仪式密钥</h3>
                  <p className="text-gold/60 text-sm leading-relaxed">
                    公共额度已耗尽。为了获得完整的占卜体验，请提供您自己的 DeepSeek API Key。
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="relative">
                    <input
                      type="password"
                      value={tempKey}
                      onChange={(e) => {
                        setTempKey(e.target.value);
                        if (error) setError(null);
                      }}
                      disabled={isValidating}
                      placeholder="sk-..."
                      className={`w-full bg-black/30 border rounded p-3 text-gold placeholder-gold/10 focus:outline-none transition-colors font-mono text-sm text-center ${
                        error 
                          ? "border-red-500/50 focus:border-red-500" 
                          : "border-gold/20 focus:border-gold/50"
                      } ${isValidating ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                    {error && (
                      <p className="absolute -bottom-6 left-0 right-0 text-red-400 text-xs">
                        {error}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-gold/5 border border-gold/10 rounded p-3 flex gap-3 items-start text-left">
                    <AlertCircle className="w-4 h-4 text-gold/50 shrink-0 mt-0.5" />
                    <p className="text-xs text-gold/50 leading-relaxed">
                      您的 Key 仅存储在本地浏览器中，不会上传至任何服务器。
                      <br />
                      <a 
                        href="https://platform.deepseek.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gold hover:underline mt-1 inline-block"
                      >
                        获取 DeepSeek API Key &rarr;
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleSave} 
                    className="w-full"
                    disabled={isValidating || !tempKey.trim()}
                  >
                    {isValidating ? "验证中..." : "确认并保存"}
                  </Button>
                  <button 
                    onClick={handleSkip}
                    className="text-gold/30 text-xs hover:text-gold/60 transition-colors py-2"
                  >
                    我没有 Key，仅生成 Prompt (手动模式)
                  </button>
                </div>
              </Frame>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
