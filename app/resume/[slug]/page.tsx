'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Lock, FileText, Download } from 'lucide-react';
import { FaangTemplate } from '@/components/templates/FaangTemplate';
import { ResumeData } from '@/types/resume';
import { toast } from 'sonner';

export default function SharedResumePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResume();
  }, [slug]);

  const fetchResume = async (pwd?: string) => {
    setIsLoading(true);
    setError('');
    try {
      const url = `/api/resume/get/${slug}`;
      const res = pwd 
        ? await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pwd })
          })
        : await fetch(url);
        
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch resume');
      }

      if (data.isProtected) {
        setIsProtected(true);
        setIsLoading(false);
        return;
      }

      setResumeData(data.data);
      setIsProtected(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResume(password);
  };

  const renderTemplate = (data: ResumeData) => {
    return <FaangTemplate data={data} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error && !isProtected) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl max-w-md text-center">
          <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Resume Unavailable</h1>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (isProtected && !resumeData) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-md w-full backdrop-blur-xl">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Protected Resume</h1>
          <p className="text-gray-400 text-center mb-8">This resume is password protected. Please enter the password to view it.</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Unlock Resume
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 flex flex-col items-center">
      {resumeData && (
        <div className="w-full max-w-[850px]">
          <div className="flex justify-between items-center mb-6 px-4">
            <h1 className="text-2xl font-bold text-gray-800">{resumeData.personalInfo.fullName}'s Resume</h1>
            <button 
              onClick={() => {
                toast.success('Download feature would trigger here.');
              }}
              className="flex items-center gap-2 bg-white border border-gray-300 shadow-sm px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
          <div className="bg-white shadow-2xl overflow-hidden print-container print:shadow-none">
            {renderTemplate(resumeData)}
          </div>
        </div>
      )}
    </div>
  );
}
