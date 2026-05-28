'use client';

import { EditorPane } from '@/components/builder/EditorPane';
import { PreviewPane } from '@/components/builder/PreviewPane';
import { Download, Share2, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export default function BuilderPage() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) {
      toast.error('Resume preview not found');
      return;
    }

    setIsExporting(true);
    toast.loading('Generating PDF...', { id: 'pdf-export' });

    try {
      // Temporarily remove borders for the screenshot if they exist
      const originalBorder = resumeElement.style.border;
      resumeElement.style.border = 'none';

      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
      });

      resumeElement.style.border = originalBorder;

      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if the resume is super long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('My_Resume.pdf');
      
      toast.success('PDF exported successfully!', { id: 'pdf-export' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF', { id: 'pdf-export' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 flex-shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gray-400" />
            AI Resume Maker
          </h1>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span>Kathil Softwares Limited</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-all">
            <Share2 className="h-4 w-4" />
            Share Link
          </button>
          <button 
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Editor */}
        <div className="w-1/2 lg:w-[45%] h-full flex-shrink-0">
          <EditorPane />
        </div>

        {/* Right Pane: Live Preview */}
        <div className="w-1/2 lg:w-[55%] h-full flex-shrink-0">
          <PreviewPane />
        </div>
      </div>
    </div>
  );
}
