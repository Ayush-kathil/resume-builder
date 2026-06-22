import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F2F1ED] font-sans text-[#1a1a1a]">
      <header className="bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-500 hover:text-[#1a1a1a] transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">Terms of Service</h1>
      </header>
      <main className="max-w-3xl mx-auto p-6 md:p-12 space-y-6">
        <h2 className="text-3xl font-playfair font-medium">Terms of Service</h2>
        <p className="text-gray-600">Last updated: June 2026</p>
        <div className="prose prose-gray max-w-none">
          <p>Welcome to AI Resume Maker. By using our service, you agree to these terms.</p>
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing or using our resume builder platform, you agree to be bound by these Terms of Service.</p>
          <h3>2. User Content</h3>
          <p>You retain all rights to the resume content you create and upload. We only use this content to provide our parsing and generation services to you.</p>
          <h3>3. Acceptable Use</h3>
          <p>You agree not to misuse our API endpoints or attempt to circumvent any rate limits or security measures.</p>
        </div>
      </main>
    </div>
  );
}
