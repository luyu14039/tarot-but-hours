"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // The content to share (The Card)
  filename?: string;
  controls?: React.ReactNode; // Optional controls like "Show Question" toggle
}

export function ShareModal({ isOpen, onClose, children, filename = "tarot-share.png", controls }: ShareModalProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = async () => {
    if (!captureRef.current) return;
    setIsGenerating(true);

    try {
      // Wait for images to load if any (though Next.js Image might be tricky, we'll see)
      // We use a slight delay to ensure rendering is stable
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dataUrl = await toPng(captureRef.current, {
        backgroundColor: "#111111", // bg-void
        pixelRatio: 2, // Retina quality
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-void border border-gold/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/20 bg-void-deep">
              <h3 className="text-gold font-serif text-lg flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                分享仪式
              </h3>
              <button
                onClick={onClose}
                className="text-gold/50 hover:text-gold transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-void-deep/50 flex flex-col items-center gap-6">
              
              {/* The Card Preview - Scaled to fit */}
              <div className="relative w-full flex justify-center">
                 {/* 
                    We render the content here for PREVIEW. 
                    We can just render it normally and let CSS handle responsiveness.
                    However, for the CAPTURE, we want a fixed width.
                    
                    Strategy:
                    1. Render the content in a hidden container for capture (Fixed Width).
                    2. Render the content here for preview (Responsive).
                 */}
                 <div className="w-full max-w-[400px] shadow-lg border border-gold/10">
                    {children}
                 </div>
              </div>

              {/* Controls (e.g. Privacy Toggle) */}
              {controls && (
                <div className="w-full max-w-[400px] py-2">
                  {controls}
                </div>
              )}

            </div>

            {/* Footer / Actions */}
            <div className="p-4 border-t border-gold/20 bg-void-deep flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>
                取消
              </Button>
              <Button onClick={handleDownload} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    绘制中...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    保存图片
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* 
            Hidden Capture Area 
            Positioned off-screen but strictly sized for consistent image generation.
            Width: 600px (Good balance for mobile/desktop sharing)
          */}
          <div 
            style={{ 
              position: "fixed", 
              left: "-9999px", 
              top: 0, 
              width: "600px",
              zIndex: -1 
            }}
          >
            <div ref={captureRef} className="bg-void text-primary-text">
               {children}
            </div>
          </div>

        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
