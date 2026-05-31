import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scanForWeakVerbs, strongVerbs } from '@/lib/actionVerbs';
import { AlertTriangle, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SmartBulletInputProps {
  value: string;
  onChange: (val: string) => void;
  onRemove: () => void;
  onRewrite: () => void;
  isAiEditing?: boolean;
}

export function SmartBulletInput({ value, onChange, onRemove, onRewrite, isAiEditing = false }: SmartBulletInputProps) {
  const [weakVerbsDetected, setWeakVerbsDetected] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounce the scanner
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        const detected = scanForWeakVerbs(value);
        setWeakVerbsDetected(detected);
      } else {
        setWeakVerbsDetected([]);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value]);

  return (
    <div className="relative group/bullet flex flex-col gap-1 w-full">
      <div className="flex items-start gap-2 w-full relative">
        <span className="text-gray-500 mt-2 text-xs">•</span>
        <textarea
          className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all min-h-[60px] ${
            isAiEditing ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-white/10'
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isAiEditing}
        />
        <AnimatePresence>
          {isAiEditing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-3 -right-3 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg flex items-center justify-center z-10"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onRemove}
          className="absolute right-10 top-2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover/bullet:opacity-100 transition-opacity bg-black/40 rounded-md backdrop-blur-sm"
          title="Remove bullet"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRewrite}
          className="absolute right-2 top-2 p-1 bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 rounded-md opacity-0 group-hover/bullet:opacity-100 transition-opacity shadow-lg"
          title="AI Rewrite"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {weakVerbsDetected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="pl-4 overflow-hidden"
          >
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-md p-2 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div className="text-xs text-orange-300/90 leading-relaxed">
                <span className="font-semibold text-orange-400">Weak verb detected: </span> 
                '{weakVerbsDetected.join("', '")}'. 
                Consider using stronger FAANG-tier verbs like: <br />
                <span className="italic opacity-80">{strongVerbs.slice(0, 4).join(", ")}, etc.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
