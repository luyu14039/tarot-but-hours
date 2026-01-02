"use client";

import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ShareModal } from "./ShareModal";

interface ShareButtonProps {
  children: React.ReactNode; // The content to share
  filename?: string;
  controls?: React.ReactNode;
  label?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
}

export function ShareButton({ children, filename, controls, label = "分享", variant = "outline", size = "md", className }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setIsOpen(true)} className={className}>
        <Share2 className="w-4 h-4 mr-2" />
        {label}
      </Button>

      <ShareModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        filename={filename}
        controls={controls}
      >
        {children}
      </ShareModal>
    </>
  );
}
