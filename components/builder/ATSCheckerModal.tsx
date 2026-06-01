import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumeData } from '@/types/resume';
import { CheckCircle2, AlertCircle, X, ShieldCheck, Loader2 } from 'lucide-react';
import { exportDocx } from '@/lib/exportDocx';
import { exportTxt } from '@/lib/exportTxt';
import { pdf } from '@react-pdf/renderer';
import { ResumePDFDocument } from '@/components/pdf/ResumePDFDocument';
import { useResumeStore } from '@/store/resumeStore';

interface ATSCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onExportPDF?: () => Promise<void>;
}

export function ATSCheckerModal({ isOpen, onClose, data, onExportPDF }: ATSCheckerModalProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [score, setScore] = useState(0);
  const [issues, setIssues] = useState<{ type: 'error' | 'warning' | 'success', message: string }[]>([]);

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      
      // Simulate scanning delay for UX
      setTimeout(() => {
        let calculatedScore = 100;
        let foundIssues: typeof issues = [];

        // Check 2: Contact Info Completeness
        if (!data.personalInfo.email || !data.personalInfo.phone) {
          calculatedScore -= 10;
          foundIssues.push({ type: 'error', message: 'Missing critical contact info (Email/Phone).' });
        } else {
          foundIssues.push({ type: 'success', message: 'Contact information is fully readable.' });
        }

        // Check 3: Standard Section Headers (implied by our schema, but let's assume they might be missing data)
        if (data.experience.length === 0) {
          calculatedScore -= 20;
          foundIssues.push({ type: 'error', message: 'No Work Experience section detected.' });
        }

        if (data.education.length === 0) {
          calculatedScore -= 15;
          foundIssues.push({ type: 'error', message: 'No Education section detected.' });
        }

        // Check 4: Keyword Density (very basic check)
        const allText = JSON.stringify(data).toLowerCase();
        if (allText.length < 500) {
          calculatedScore -= 10;
          foundIssues.push({ type: 'warning', message: 'Resume is very short; might lack necessary industry keywords.' });
        }

        setScore(Math.max(0, calculatedScore));
        setIssues(foundIssues);
        setIsScanning(false);
      }, 1500);
    }
  }, [isOpen, data]);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      if (onExportPDF) {
        await onExportPDF();
      } else {
        const blob = await pdf(<ResumePDFDocument data={data} />).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.personalInfo.fullName || 'Untitled'}_Resume.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setIsExportingPDF(false);
      onClose();
    }
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportDocx(data);
    } catch (error) {
      console.error("Failed to export DOCX:", error);
    } finally {
      setIsExportingDocx(false);
      onClose();
    }
  };

  const handleExportTxt = () => {
    exportTxt(data);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-3xl bg-white border border-[#e5e5e5] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-[#1a1a1a] z-10">
              <X className="w-5 h-5" />
            </button>

            {/* Left side: ATS Score */}
            <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-[#e5e5e5] bg-[#f9f9f9] flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-12 h-12 text-[#1a1a1a] mb-4" />
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2 font-playfair">ATS Pre-Check</h2>
              <p className="text-sm text-gray-500 mb-8 px-4">
                We're scanning your resume for Applicant Tracking System (ATS) compatibility before you export.
              </p>

              {isScanning ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-[#1a1a1a] animate-spin" />
                  <span className="text-sm text-gray-500 animate-pulse">Running diagnostics...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-lg shadow-black/5 bg-white ${
                      score >= 80 ? 'border-emerald-500 text-emerald-500' :
                      score >= 60 ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'
                    }`}
                  >
                    <span className="text-5xl font-extrabold">{score}</span>
                  </motion.div>
                  <span className="mt-4 text-lg font-medium text-[#1a1a1a]">
                    {score >= 80 ? 'Excellent' : score >= 60 ? 'Needs Improvement' : 'Poor'} Compatibility
                  </span>
                </div>
              )}
            </div>

            {/* Right side: Results & Export */}
            <div className="w-full md:w-1/2 p-8 flex flex-col h-full bg-white">
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Diagnostic Results</h3>
                
                {isScanning ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-full h-12 bg-[#f9f9f9] animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {issues.map((issue, idx) => (
                      <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${
                        issue.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                        issue.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                        'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        {issue.type === 'error' || issue.type === 'warning' ? (
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm leading-relaxed font-medium">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#e5e5e5]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Download As</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleExportPDF}
                    disabled={isScanning || isExportingPDF}
                    className="flex flex-col items-center gap-2 p-3 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl hover:bg-white hover:border-[#1a1a1a] hover:shadow-sm transition-all disabled:opacity-50 group"
                  >
                    {isExportingPDF ? <Loader2 className="w-5 h-5 animate-spin text-red-500" /> : <div className="text-red-500 font-bold group-hover:scale-110 transition-transform">PDF</div>}
                    <span className="text-[10px] text-gray-500 font-medium">Universal</span>
                  </button>
                  <button
                    onClick={handleExportDocx}
                    disabled={isScanning || isExportingDocx}
                    className="flex flex-col items-center gap-2 p-3 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl hover:bg-white hover:border-[#1a1a1a] hover:shadow-sm transition-all disabled:opacity-50 group"
                  >
                    {isExportingDocx ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <div className="text-blue-500 font-bold group-hover:scale-110 transition-transform">DOCX</div>}
                    <span className="text-[10px] text-gray-500 font-medium">Editable</span>
                  </button>
                  <button
                    onClick={handleExportTxt}
                    disabled={isScanning}
                    className="flex flex-col items-center gap-2 p-3 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl hover:bg-white hover:border-[#1a1a1a] hover:shadow-sm transition-all disabled:opacity-50 group"
                  >
                    <div className="text-gray-600 font-bold group-hover:scale-110 transition-transform">TXT</div>
                    <span className="text-[10px] text-gray-500 font-medium">Raw Text</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
