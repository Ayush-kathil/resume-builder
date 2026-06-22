'use client';

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfDocument } from './PdfDocument';
import { ResumeData } from '@/types/resume';
import { Download, Loader2 } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

interface PdfExportButtonProps {
  data: ResumeData;
}

export default function PdfExportButton({ data }: PdfExportButtonProps) {
  const { themeConfig } = useResumeStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button disabled className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1a1a1a]/50 text-[#F2F1ED] text-sm font-medium">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<PdfDocument data={data} themeConfig={themeConfig} />}
      fileName={`${data.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_Premium.pdf`}
      className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 rounded-full bg-[#1a1a1a] text-[#F2F1ED] text-sm font-medium hover:bg-black transition-all"
    >
      {({ blob, url, loading, error }) => (
        <>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden sm:inline">{loading ? 'Preparing...' : 'Download'}</span>
        </>
      )}
    </PDFDownloadLink>
  );
}
