'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, ArrowLeft, Upload, Loader2, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { toast } from 'sonner';

export type SetupMode = 'fresh' | 'upload' | null;

interface SmartSetupModalProps {
  isOpen: boolean;
  mode: SetupMode;
  onClose: () => void;
}

export function SmartSetupModal({ isOpen, mode, onClose }: SmartSetupModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setResumeData } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Questionnaire State
  const [targetRole, setTargetRole] = useState('');
  const [targetJD, setTargetJD] = useState('');
  const [industryKeywords, setIndustryKeywords] = useState('');
  
  const [achievements, setAchievements] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [gaps, setGaps] = useState('');
  
  const [metrics, setMetrics] = useState('');
  const [businessOutcomes, setBusinessOutcomes] = useState('');
  const [peopleBudgets, setPeopleBudgets] = useState('');
  
  const [tone, setTone] = useState('');
  const [layout, setLayout] = useState('1-page');
  const [sectionsToRemove, setSectionsToRemove] = useState('');

  const resetState = () => {
    setStep(1);
    setTargetRole(''); setTargetJD(''); setIndustryKeywords('');
    setAchievements(''); setNewSkills(''); setGaps('');
    setMetrics(''); setBusinessOutcomes(''); setPeopleBudgets('');
    setTone(''); setLayout('1-page'); setSectionsToRemove('');
    onClose();
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else if (mode === 'fresh') handleGenerateFresh();
    else if (mode === 'upload') fileInputRef.current?.click(); // Trigger file upload
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerateFresh = async () => {
    setIsProcessing(true);
    toast.loading('Generating your highly optimized resume...', { id: 'gen' });
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetRole, targetJD, industryKeywords,
          achievements, newSkills, gaps,
          metrics, businessOutcomes, peopleBudgets,
          tone, layout, sectionsToRemove
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate boilerplate');

      setResumeData(data);
      toast.success('Resume generated!', { id: 'gen' });
      resetState();
      router.push('/builder');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Generation failed', { id: 'gen' });
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    toast.loading('Analyzing and parsing your existing resume...', { id: 'parse' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('setupData', JSON.stringify({
      targetRole, targetJD, industryKeywords,
      achievements, newSkills, gaps,
      metrics, businessOutcomes, peopleBudgets,
      tone, layout, sectionsToRemove
    }));

    try {
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse resume');

      setResumeData(data.data || data); // The API might return { data: {...} } or just {...}
      toast.success('Resume parsed and structured successfully!', { id: 'parse' });
      resetState();
      router.push('/builder');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An unexpected error occurred during parsing.', { id: 'parse' });
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const springConfig = { type: 'spring' as const, stiffness: 300, damping: 30 };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={springConfig}
        className="w-full max-w-3xl bg-[#09090b] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
      >
        <button onClick={resetState} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20">
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-8 text-indigo-400">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium tracking-wide uppercase text-sm">
            {mode === 'fresh' ? 'AI Setup: Start Fresh' : 'AI Setup: Upgrade Resume'}
          </span>
        </div>

        {/* Hidden File Input for Upload Mode */}
        <input 
          type="file" 
          accept=".pdf,.docx" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />

        <div className="relative h-[450px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Core Target */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 1: Core Target</h2>
                <p className="text-gray-400 text-sm mb-6">Let's align your resume perfectly with your next role.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">What is your exact target job title?</label>
                    <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Senior Product Manager" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Target Job Description (Paste here)</label>
                    <textarea value={targetJD} onChange={e => setTargetJD(e.target.value)} placeholder="Paste the JD to heavily optimize your keywords..." className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Which industry keywords do you want to highlight?</label>
                    <input type="text" value={industryKeywords} onChange={e => setIndustryKeywords(e.target.value)} placeholder="e.g. React, Next.js, System Design, B2B SaaS" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Gaps & Updates */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 2: Gaps & Updates</h2>
                <p className="text-gray-400 text-sm mb-6">Tell us what's new so we can weave it into your narrative.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">What have you achieved since your last resume update?</label>
                    <textarea value={achievements} onChange={e => setAchievements(e.target.value)} placeholder="e.g. Led a 5-person team, shipped a mobile app..." className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">What new skills or tools have you learned?</label>
                    <input type="text" value={newSkills} onChange={e => setNewSkills(e.target.value)} placeholder="e.g. Python, AWS Cloud Practitioner, Figma" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">How should we explain any employment gaps?</label>
                    <input type="text" value={gaps} onChange={e => setGaps(e.target.value)} placeholder="e.g. Sabbatical to travel, took care of family, upskilling bootcamp" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Quantifiable Results */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 3: Quantifiable Results</h2>
                <p className="text-gray-400 text-sm mb-6">Numbers win interviews. Let's dig up your metrics.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">What metrics, dollars, or percentages can we add?</label>
                    <textarea value={metrics} onChange={e => setMetrics(e.target.value)} placeholder="e.g. Increased sales by 20%, saved $50k in server costs..." className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">What was the final business outcome of your major projects?</label>
                    <input type="text" value={businessOutcomes} onChange={e => setBusinessOutcomes(e.target.value)} placeholder="e.g. Company acquired for $10M, product reached #1 on App Store" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">How many people or budgets did you manage?</label>
                    <input type="text" value={peopleBudgets} onChange={e => setPeopleBudgets(e.target.value)} placeholder="e.g. Managed 12 direct reports, $1M annual marketing budget" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Formatting & Tone */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 4: Tone & Formatting</h2>
                <p className="text-gray-400 text-sm mb-6">Final touches on how your resume feels and looks.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">What tone do you want?</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Corporate', 'Creative', 'Academic'].map((t) => (
                        <button key={t} onClick={() => setTone(t)} className={`py-3 rounded-xl text-sm font-medium border transition-colors ${tone === t ? 'bg-indigo-600 text-white border-transparent' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Layout Density</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['1-page', '2-page'].map((l) => (
                        <button key={l} onClick={() => setLayout(l)} className={`py-3 rounded-xl text-sm font-medium border transition-colors ${layout === l ? 'bg-indigo-600 text-white border-transparent' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>
                          {l} Density
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Which sections do you want to hide/remove?</label>
                    <input type="text" value={sectionsToRemove} onChange={e => setSectionsToRemove(e.target.value)} placeholder="e.g. Hide education, hide projects..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 flex justify-between items-center border-t border-white/10 pt-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${step >= i ? 'bg-indigo-500' : 'bg-white/10'}`} />
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={handlePrev} disabled={isProcessing} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isProcessing || (step === 1 && !targetRole)}
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
              ) : step === 4 ? (
                mode === 'fresh' ? <><Sparkles className="h-4 w-4" /> Generate Resume</> : <><Upload className="h-4 w-4" /> Upload & Parse PDF</>
              ) : (
                <>Next <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
