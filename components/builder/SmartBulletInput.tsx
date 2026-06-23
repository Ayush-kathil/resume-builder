import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinterService, LintResult } from './LinterService';
import { strongVerbs } from '@/lib/actionVerbs';
import { AlertTriangle, Trash2, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface SmartBulletInputProps {
  value: string;
  onChange: (val: string) => void;
  onRemove: () => void;
  onRewrite: (actionType: string) => void;
  isAiEditing?: boolean;
}

export function SmartBulletInput({ value, onChange, onRemove, onRewrite, isAiEditing = false }: SmartBulletInputProps) {
  const [lintResult, setLintResult] = useState<LintResult>({
    text: '',
    hasNumbers: false,
    weakVerbs: [],
    buzzwords: [],
    isTooLong: false,
    missingPeriod: false
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        setLintResult(LinterService.analyzeBullet(value));
      } else {
        setLintResult({ text: '', hasNumbers: false, weakVerbs: [], buzzwords: [], isTooLong: false, missingPeriod: false });
      }
    }, 300);

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
        <span className="text-gray-400 mt-2 text-xs">•</span>
        <div className="relative w-full group/textarea">
          {/* Visual Overlay for Linter (Heatmap & Underlines) */}
          <div 
            className={`absolute inset-0 pointer-events-none px-3 py-2 text-sm whitespace-pre-wrap break-words overflow-hidden ${isAiEditing ? 'opacity-0' : 'opacity-100'} text-transparent z-0`}
            dangerouslySetInnerHTML={{ __html: LinterService.generateHighlightedHtml(value) }}
          />
          
          <textarea
            className={`w-full bg-transparent relative z-10 border rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all min-h-[60px] ${
              isAiEditing ? 'border-[#1a1a1a] bg-[#f9f9f9] opacity-50 shadow-[0_0_10px_rgba(26,26,26,0.1)]' : 'border-[#e5e5e5]'
            }`}
            style={{ color: lintResult.hasNumbers || lintResult.weakVerbs.length > 0 || lintResult.buzzwords.length > 0 ? 'transparent' : 'inherit', caretColor: '#1a1a1a' }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isAiEditing}
          />
          
          <AnimatePresence>
            {isAiEditing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-lg z-10"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-medium rounded-full shadow-md">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                  Generating...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute right-2 top-2 opacity-0 group-hover/bullet:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={onRemove}
            className="p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-md border border-[#e5e5e5] shadow-sm flex items-center justify-center transition-colors"
            title="Remove bullet"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 bg-[#f9f9f9] text-[#1a1a1a] hover:bg-[#e5e5e5] rounded-md border border-[#e5e5e5] shadow-sm flex items-center gap-1 transition-colors"
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
                className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#e5e5e5] rounded-lg shadow-lg z-20 overflow-hidden"
              >
                <div className="flex flex-col py-1">
                  {[
                    { label: 'Improve Grammar', action: 'improve' },
                    { label: 'Show, Don\'t Tell', action: 'show-dont-tell' },
                    { label: 'Verify STAR Format', action: 'star-validator' },
                    { label: 'Shorten', action: 'shorten' },
                  ].map((item) => (
                    <button
                      key={item.action}
                      onClick={() => {
                        setIsMenuOpen(false);
                        onRewrite(item.action);
                      }}
                      className="px-3 py-1.5 text-xs text-left text-gray-700 hover:bg-[#f9f9f9] hover:text-[#1a1a1a] transition-colors"
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

      {/* Linter Feedback UI */}
      <AnimatePresence>
        {(lintResult.weakVerbs.length > 0 || lintResult.buzzwords.length > 0 || lintResult.isTooLong || lintResult.missingPeriod || (!lintResult.hasNumbers && value.length > 20)) && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="pl-4 overflow-hidden flex flex-col gap-1.5 mt-1"
          >
            {lintResult.weakVerbs.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="text-xs text-red-800 leading-relaxed">
                  <span className="font-semibold text-red-600">Weak verb detected: </span> 
                  '{lintResult.weakVerbs.join("', '")}'. 
                  Consider using stronger FAANG-tier verbs like: <br />
                  <span className="italic text-red-700">{strongVerbs.slice(0, 4).join(", ")}, etc.</span>
                </div>
              </div>
            )}
            
            {lintResult.buzzwords.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-800 leading-relaxed">
                  <span className="font-semibold text-yellow-600">Corporate Buzzword detected: </span> 
                  '{lintResult.buzzwords.join("', '")}'. 
                  Recruiters ignore these. Replace with hard technical skills or measurable metrics.
                </div>
              </div>
            )}
            
            {lintResult.isTooLong && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-semibold text-amber-600">Bullet length warning: </span> 
                  This bullet exceeds 160 characters. FAANG recruiters scan rapidly. Keep bullets concise (1-2 lines maximum) for highest impact.
                </div>
              </div>
            )}
            
            {!lintResult.hasNumbers && value.length > 20 && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-2 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-700">Quantification Check: </span> 
                  No numbers or metrics detected. Use the STAR method and quantify your impact (e.g., "Increased X by Y%").
                </div>
              </div>
            )}

            {lintResult.missingPeriod && value.length > 10 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 leading-relaxed">
                  <span className="font-semibold text-blue-600">Punctuation Check: </span> 
                  Missing a period at the end. Be perfectly consistent with punctuation across your resume.
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
