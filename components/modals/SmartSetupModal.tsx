'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, Upload, Loader2, FileText, ChevronDown } from 'lucide-react';
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

// Premium Custom Dropdown Component
function CustomDropdown({ value, onChange, options, placeholder, label }: { value: string, onChange: (v: string) => void, options: string[], placeholder: string, label: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on input
  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative group">
        <input 
          type="text" 
          value={value} 
          onChange={e => {
            onChange(e.target.value);
            setIsOpen(true);
          }} 
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder} 
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-sans shadow-sm" 
        />
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors pointer-events-none" />
      </div>
      
      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-56 overflow-y-auto custom-scrollbar"
          >
            {filteredOptions.map((opt) => (
              <div 
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors text-sm text-gray-700 hover:text-black border-b border-gray-50 last:border-0"
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


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
        className="w-full max-w-2xl bg-white border border-[#e5e5e5] rounded-[2rem] p-10 relative overflow-hidden shadow-2xl"
      >
        <button onClick={resetState} className="absolute top-8 right-8 text-gray-400 hover:text-[#1a1a1a] transition-colors z-20">
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-8 text-[#1a1a1a]">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-playfair tracking-wide font-semibold text-xl block leading-none">
              {mode === 'fresh' ? 'Start Fresh' : 'Upgrade Resume'}
            </span>
            <span className="text-xs text-gray-400 font-medium tracking-wider uppercase mt-1 block">AI Setup Wizard</span>
          </div>
        </div>

        {/* Hidden File Input for Upload Mode */}
        <input 
          type="file" 
          accept=".pdf,.docx,.doc" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />

        <div className="relative h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Core Target */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pb-4">
                <div className="border-b border-gray-100 pb-5">
                  <h2 className="text-3xl font-playfair font-semibold text-[#1a1a1a] mb-2 tracking-tight">Target Role & Aspirations</h2>
                  <p className="text-gray-500 text-sm">Let our AI perfectly tailor your resume trajectory to your dream role.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Primary Objective</label>
                    <input 
                      type="text" 
                      value={targetRole} 
                      onChange={e => setTargetRole(e.target.value)} 
                      placeholder="e.g. Senior Frontend Engineer" 
                      className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3.5 text-lg text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-medium placeholder:font-normal placeholder:text-gray-300" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <CustomDropdown 
                      label="Target Company"
                      value={targetCompany}
                      onChange={setTargetCompany}
                      options={ASIAN_COMPANIES}
                      placeholder="e.g. Amazon, Stripe..."
                    />

                    <CustomDropdown 
                      label="Core Skills to Inject"
                      value={targetSkills}
                      onChange={setTargetSkills}
                      options={TECH_SKILLS}
                      placeholder="e.g. React, Node.js"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Updates & Import */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h2 className="text-4xl font-playfair font-medium text-[#1a1a1a] mb-3 tracking-tight">{mode === 'fresh' ? 'Recent Achievements' : 'Import Your Data'}</h2>
                  <p className="text-gray-500 text-base">{mode === 'fresh' ? 'What have you achieved recently?' : 'Paste text from LinkedIn, or simply click upload for your PDF/DOCX.'}</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Any specific achievements to guarantee inclusion? (Optional)</label>
                    <textarea 
                      value={achievements} 
                      onChange={e => setAchievements(e.target.value)} 
                      placeholder="e.g. Led a team of 5, increased sales by 20%, won Hackathon..." 
                      className="w-full h-24 bg-[#F2F1ED] border border-[#e5e5e5] rounded-2xl px-5 py-4 text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-all resize-none font-sans" 
                    />
                  </div>
                  
                  {mode === 'upload' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Paste Raw Text (LinkedIn, Portfolio)</label>
                      <textarea 
                        value={rawText} 
                        onChange={e => setRawText(e.target.value)} 
                        placeholder="Leave blank to upload a file instead..." 
                        className="w-full h-32 bg-[#F2F1ED] border border-[#e5e5e5] rounded-2xl px-5 py-4 text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-all resize-none font-sans" 
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-6">
          <div className="flex gap-1.5">
            {[1, 2].map((i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-black' : step > i ? 'w-2 bg-black' : 'w-2 bg-gray-200'}`} />
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={handlePrev} disabled={isProcessing} className="px-5 py-2.5 text-sm text-gray-500 hover:text-black transition-colors disabled:opacity-50 font-semibold hover:bg-gray-50 rounded-xl">
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isProcessing || (step === 1 && !targetRole)}
              className="group flex items-center gap-3 bg-black text-white px-7 py-3 rounded-xl font-medium shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isProcessing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Processing</>
              ) : step === 2 ? (
                mode === 'fresh' ? <><Sparkles className="h-4 w-4 text-yellow-400" /> Generate</> : 
                (rawText ? <><FileText className="h-4 w-4" /> Parse Text</> : <><Upload className="h-4 w-4" /> Upload PDF</>)
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
