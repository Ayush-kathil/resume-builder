import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F2F1ED] font-sans text-[#1a1a1a]">
      <header className="bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-500 hover:text-[#1a1a1a] transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">Privacy Policy</h1>
      </header>
      <main className="max-w-3xl mx-auto p-6 md:p-12 space-y-6">
        <h2 className="text-3xl font-playfair font-medium">Privacy Policy</h2>
        <p className="text-gray-600">Last updated: June 2026</p>
        <div className="prose prose-gray max-w-none">
          <p>Your privacy is critically important to us. This policy outlines how we handle your data.</p>
          <h3>1. Data Collection</h3>
          <p>We collect information you provide directly to us when you create an account and build your resume.</p>
          <h3>2. Use of AI</h3>
          <p>Your resume data is processed securely through Google Generative AI APIs to provide parsing and rewriting features. We do not use your personal data to train public AI models.</p>
          <h3>3. Data Security</h3>
          <p>We implement standard security measures to protect your data. You can delete your account and all associated data at any time from your profile settings.</p>
        </div>
      </main>
    </div>
  );
}
