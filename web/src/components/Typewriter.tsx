"use client";

import { useState, useEffect } from "react";
import { AspectIcon } from "./AspectIcon";

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

type Token = 
  | { type: "text"; content: string }
  | { type: "icon"; name: string };

export function Typewriter({ text, speed = 30, onComplete, className }: TypewriterProps) {
  const [displayedContent, setDisplayedContent] = useState<React.ReactNode[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Parse text into tokens
  // Format: "Some text <Icon name='moth'/> more text"
  const parseTokens = (inputText: string): Token[] => {
    const regex = /<Icon name=['"](\w+)['"]\s*\/?>/g;
    const tokens: Token[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(inputText)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: "text", content: inputText.slice(lastIndex, match.index) });
      }
      tokens.push({ type: "icon", name: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < inputText.length) {
      tokens.push({ type: "text", content: inputText.slice(lastIndex) });
    }

    return tokens;
  };

  useEffect(() => {
    const tokens = parseTokens(text);
    let currentTokenIndex = 0;
    let currentCharIndex = 0;
    let currentNodes: React.ReactNode[] = [];
    let timeoutId: NodeJS.Timeout;

    const typeNext = () => {
      if (currentTokenIndex >= tokens.length) {
        setIsComplete(true);
        onComplete?.();
        return;
      }

      const token = tokens[currentTokenIndex];

      if (token.type === "icon") {
        // Icon appears instantly as one "character"
        currentNodes = [...currentNodes, <AspectIcon key={`icon-${currentTokenIndex}`} aspect={token.name} size={20} className="mx-1 translate-y-[-2px]" />];
        setDisplayedContent([...currentNodes]);
        currentTokenIndex++;
        timeoutId = setTimeout(typeNext, speed);
      } else {
        // Text appears character by character
        const nextChar = token.content[currentCharIndex];
        
        // If it's the start of a text node, we might need to append a new string or update the last one
        // But since we are storing ReactNodes, we can't easily update the last string node if it's mixed.
        // Strategy: Re-render the whole valid part.
        
        // Optimization: We construct the array of nodes.
        // For the current text token, we slice it.
        
        const previousNodes = tokens.slice(0, currentTokenIndex).map((t, i) => {
            if (t.type === "icon") return <AspectIcon key={`icon-${i}`} aspect={t.name} size={20} className="mx-1 translate-y-[-2px]" />;
            return <span key={`text-${i}`}>{t.content}</span>;
        });

        const currentText = token.content.slice(0, currentCharIndex + 1);
        
        setDisplayedContent([
            ...previousNodes,
            <span key={`text-${currentTokenIndex}`}>{currentText}</span>
        ]);

        currentCharIndex++;
        if (currentCharIndex >= token.content.length) {
          currentTokenIndex++;
          currentCharIndex = 0;
        }
        timeoutId = setTimeout(typeNext, speed);
      }
    };

    timeoutId = setTimeout(typeNext, speed);

    return () => clearTimeout(timeoutId);
  }, [text, speed]);

  return (
    <div className={className}>
      {displayedContent}
      {!isComplete && <span className="animate-pulse text-gold">|</span>}
    </div>
  );
}
