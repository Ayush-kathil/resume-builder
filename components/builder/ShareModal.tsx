import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, Lock, Copy, CheckCircle2, Globe, Loader2 } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const { data } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        data,
        password: usePassword && password.trim() ? password : undefined,
      };

      const res = await fetch('/api/resume/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to generate link');
      }

      setShareUrl(result.url);
      toast.success('Share link generated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-md bg-[#09090b] border border-white/20 rounded-2xl shadow-2xl p-6"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Share Resume</h2>
              <p className="text-sm text-gray-400">Generate a public link to share your resume with recruiters or colleagues.</p>
            </div>

            {!shareUrl ? (
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={usePassword}
                    onChange={(e) => setUsePassword(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 bg-black/50"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400" /> Password Protect
                    </span>
                    <span className="text-[11px] text-gray-500">Require a password to view this link</span>
                  </div>
                </label>

                {usePassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <input
                      type="password"
                      placeholder="Enter a secure password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </motion.div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
                  {isGenerating ? 'Generating...' : 'Generate Public Link'}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-4">
                  <div className="truncate text-sm font-mono text-emerald-400 flex-1 select-all">
                    {shareUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-300 transition-colors shrink-0"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  This link will automatically expire in 30 days.{' '}
                  {usePassword && <span className="text-indigo-400">It is password protected.</span>}
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                  Done
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
