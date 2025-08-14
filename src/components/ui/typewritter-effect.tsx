// components/ui/typewriter-effect.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterEffectProps {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  onTypingComplete?: () => void;
}

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
  onTypingComplete,
}: TypewriterEffectProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex % words.length];
    
    // Typing speed adjustments
    const typingSpeed = isDeleting ? 30 : 100;
    const pauseBetweenWords = 1500;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (currentCharIndex < currentWord.text.length) {
          setDisplayText(prev => prev + currentWord.text[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
        } else {
          // Finished typing word
          if (currentWordIndex === words.length - 1) {
            setIsComplete(true);
            onTypingComplete?.();
          }
          setIsDeleting(true);
          setTimeout(() => {}, pauseBetweenWords);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(prev => prev.slice(0, -1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex(prev => (prev + 1) % words.length);
          setCurrentCharIndex(0);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentWordIndex, currentCharIndex, isDeleting, words, onTypingComplete]);

  return (
    <div className={cn(
      "flex flex-wrap justify-center text-center",
      "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter",
      className
    )}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className={cn(
            "inline-block",
            word.className,
            {
              "text-transparent bg-clip-text bg-gradient-to-b from-foreground to-gray-500":
                !word.className?.includes("bg-gradient"),
              "opacity-0 h-0 overflow-hidden": 
                index > currentWordIndex % words.length,
              "mr-2": index < words.length - 1
            }
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: index <= currentWordIndex % words.length ? 1 : 0,
            y: index <= currentWordIndex % words.length ? 0 : 20
          }}
          transition={{ duration: 0.3 }}
        >
          {index === currentWordIndex % words.length
            ? displayText
            : index < currentWordIndex % words.length
            ? word.text
            : ""}
        </motion.span>
      ))}
      
      {!isComplete && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            repeatType: "reverse",
          }}
          className={cn(
            "inline-block w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-500 ml-1",
            cursorClassName
          )}
        />
      )}
    </div>
  );
};