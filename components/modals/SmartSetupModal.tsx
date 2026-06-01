'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, Upload, Loader2, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { toast } from 'sonner';

export type SetupMode = 'fresh' | 'upload' | null;

interface SmartSetupModalProps {
  isOpen: boolean;
  mode: SetupMode;
  onClose: () => void;
}

const ASIAN_COMPANIES = [
  "TCS", "Infosys", "Wipro", "HCLTech", "Tech Mahindra", "Reliance Industries", 
  "Tata Motors", "HDFC Bank", "ICICI Bank", "SBI", "Flipkart", "Zomato", "Swiggy", 
  "Paytm", "Ola", "Samsung", "Sony", "Toyota", "Honda", "SoftBank", "Alibaba", 
  "Tencent", "Baidu", "ByteDance", "Grab", "Gojek", "Shopee", "Sea Group"
];

const TECH_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Java", "C++", 
  "C#", "Go", "Rust", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "SQL", "MongoDB", 
  "PostgreSQL", "Redis", "GraphQL", "Machine Learning", "System Design", "DevOps"
];

export function SmartSetupModal({ isOpen, mode, onClose }: SmartSetupModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setResumeData } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Questionnaire State
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [targetSkills, setTargetSkills] = useState('');
  const [achievements, setAchievements] = useState('');
  const [rawText, setRawText] = useState('');

  const resetState = () => {
    setStep(1);
    setTargetRole(''); setTargetCompany(''); setTargetSkills('');
    setAchievements(''); setRawText('');
    onClose();
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else if (mode === 'fresh') handleGenerateFresh();
    else if (mode === 'upload' && !rawText) fileInputRef.current?.click();
    else if (mode === 'upload' && rawText) handleTextUpload();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const getPayload = () => ({
    targetRole, targetCompany, targetSkills, achievements
  });

  const handleGenerateFresh = async () => {
    setIsProcessing(true);
    toast.loading('Generating your highly optimized resume...', { id: 'gen' });
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload()),
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

  const processParseResponse = (data: any) => {
    setResumeData(data.data || data);
    toast.success('Resume parsed and structured successfully!', { id: 'parse' });
    resetState();
    router.push('/builder');
  };

  const handleTextUpload = async () => {
    setIsProcessing(true);
    toast.loading('Analyzing your pasted text...', { id: 'parse' });
    try {
      const formData = new FormData();
      formData.append('rawText', rawText);
      formData.append('setupData', JSON.stringify(getPayload()));

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse text');
      
      processParseResponse(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error parsing text.', { id: 'parse' });
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    toast.loading('Analyzing and parsing your existing document...', { id: 'parse' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('setupData', JSON.stringify(getPayload()));

    try {
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse document');

      processParseResponse(data);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={springConfig}
        className="w-full max-w-2xl bg-white border border-[#e5e5e5] rounded-3xl p-8 relative overflow-hidden shadow-2xl"
      >
        <button onClick={resetState} className="absolute top-6 right-6 text-gray-400 hover:text-[#1a1a1a] transition-colors z-20">
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-8 text-[#1a1a1a]">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium tracking-wide uppercase text-sm">
            {mode === 'fresh' ? 'AI Setup: Start Fresh' : 'AI Setup: Upgrade Resume'}
          </span>
        </div>

        {/* Hidden File Input for Upload Mode */}
        <input 
          type="file" 
          accept=".pdf,.docx,.doc" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />

        <div className="relative h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Core Target */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-playfair font-bold text-[#1a1a1a] mb-2">Target Role & Aspirations</h2>
                <p className="text-gray-500 text-sm mb-6">Let's align your resume perfectly with your next role.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What is your exact target job title?</label>
                    <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Senior Software Engineer" className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Company (Optional)</label>
                    <input list="asian-companies" type="text" value={targetCompany} onChange={e => setTargetCompany(e.target.value)} placeholder="e.g. TCS, Infosys, Flipkart..." className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]" />
                    <datalist id="asian-companies">
                      {ASIAN_COMPANIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills / Technologies</label>
                    <input list="tech-skills" type="text" value={targetSkills} onChange={e => setTargetSkills(e.target.value)} placeholder="e.g. React, Next.js, System Design" className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]" />
                    <datalist id="tech-skills">
                      {TECH_SKILLS.map(s => <option key={s} value={s} />)}
                    </datalist>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Updates & Import */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-playfair font-bold text-[#1a1a1a] mb-2">{mode === 'fresh' ? 'Recent Achievements' : 'Import Your Data'}</h2>
                <p className="text-gray-500 text-sm mb-6">{mode === 'fresh' ? 'What have you achieved recently?' : 'Paste your LinkedIn profile text, portfolio text, or click Next to upload a PDF/DOCX.'}</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Any specific achievements to highlight? (Optional)</label>
                    <textarea value={achievements} onChange={e => setAchievements(e.target.value)} placeholder="e.g. Led a team of 5, increased sales by 20%..." className="w-full h-20 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] resize-none" />
                  </div>
                  
                  {mode === 'upload' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paste Raw Text (LinkedIn, Portfolio, etc.)</label>
                      <textarea value={rawText} onChange={e => setRawText(e.target.value)} placeholder="Leave blank if you prefer to upload a PDF/DOCX file instead..." className="w-full h-32 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] resize-none" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 flex justify-between items-center border-t border-[#e5e5e5] pt-6">
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${step >= i ? 'bg-[#1a1a1a]' : 'bg-gray-200'}`} />
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={handlePrev} disabled={isProcessing} className="px-4 py-2 text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors disabled:opacity-50 font-medium">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isProcessing || (step === 1 && !targetRole)}
              className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full font-medium hover:bg-black transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
              ) : step === 2 ? (
                mode === 'fresh' ? <><Sparkles className="h-4 w-4" /> Generate</> : 
                (rawText ? <><FileText className="h-4 w-4" /> Parse Text</> : <><Upload className="h-4 w-4" /> Upload Document</>)
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
