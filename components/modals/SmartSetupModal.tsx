'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';

interface SmartSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartSetupModal({ isOpen, onClose }: SmartSetupModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [tone, setTone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { setResumeData } = useResumeStore();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetRole: role,
          department,
          tone
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate boilerplate');

      setResumeData(data);
      router.push('/builder');
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const springConfig = { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={springConfig}
            className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10">
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3 mb-10 text-indigo-400">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium tracking-wide uppercase text-sm">AI Smart Setup</span>
            </div>

            <div className="relative h-48">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">What is your target department or industry?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Engineering', 'Product', 'Sales', 'Design'].map((dept) => (
                        <button
                          key={dept}
                          onClick={() => { setDepartment(dept); setTimeout(() => setStep(2), 200); }}
                          className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                            department === dept 
                              ? 'bg-indigo-600 text-white border-transparent' 
                              : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">What is your target role/title?</h2>
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. Senior Frontend Engineer"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && role && handleNext()}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">What specific features or tone should the AI emphasize?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['Leadership focus', 'Technical depth', 'Aggressive growth', 'Creative flair'].map((t) => (
                        <button
                          key={t}
                          onClick={() => { setTone(t); }}
                          className={`py-4 px-5 text-left rounded-xl text-sm font-medium transition-all ${
                            tone === t 
                              ? 'bg-indigo-600 text-white border-transparent' 
                              : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-6">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-1.5 w-8 rounded-full ${step >= i ? 'bg-indigo-500' : 'bg-white/10'}`} />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={isGenerating || (step === 2 && !role) || (step === 3 && !tone)}
                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : step === 3 ? 'Generate Resume' : 'Continue'}
                {!isGenerating && step < 3 && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
