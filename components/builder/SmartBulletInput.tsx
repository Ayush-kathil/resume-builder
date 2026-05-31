import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scanForWeakVerbs, strongVerbs } from '@/lib/actionVerbs';
import { AlertTriangle, Trash2, Sparkles, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface SmartBulletInputProps {
  value: string;
  onChange: (val: string) => void;
  onRemove: () => void;
  onRewrite: (actionType: string) => void;
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div 
      className="relative group/bullet flex flex-col gap-1 w-full"
      onMouseLeave={() => setIsMenuOpen(false)}
    >
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
        <div className="absolute right-2 top-2 opacity-0 group-hover/bullet:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={onRemove}
            className="p-1.5 bg-black/40 text-gray-500 hover:text-red-400 rounded-md backdrop-blur-sm shadow-lg flex items-center justify-center transition-colors"
            title="Remove bullet"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 rounded-md shadow-lg flex items-center gap-1 backdrop-blur-sm"
            title="AI Actions"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <ChevronDown className="w-3 h-3" />
          </button>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-full mt-1 w-40 bg-[#111113]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden"
              >
                <div className="flex flex-col py-1">
                  {[
                    { label: 'Improve', action: 'improve' },
                    { label: 'Quantify Impact', action: 'quantify' },
                    { label: 'ATS Optimize', action: 'ats-optimize' },
                    { label: 'Make Professional', action: 'professional' },
                    { label: 'Shorten', action: 'shorten' },
                  ].map((item) => (
                    <button
                      key={item.action}
                      onClick={() => {
                        setIsMenuOpen(false);
                        onRewrite(item.action);
                      }}
                      className="px-3 py-1.5 text-xs text-left text-gray-300 hover:bg-indigo-500/20 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
