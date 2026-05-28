'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FileText, Sparkles, Target, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] flex flex-col items-center justify-center">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-white/5 rounded-full blur-[100px]"
        />
      </div>

      <div className="z-10 container px-4 md:px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300 backdrop-blur-md mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            <span className="font-medium">AI-Powered Resume Architect</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            Elevate Your Career with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
              Antigravity Design.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-[600px] mx-auto">
            Build premium, ATS-optimized resumes in minutes. Our AI analyzes job descriptions, rewrites bullet points, and generates a flawless layout.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden rounded-full bg-white text-black px-8 py-4 font-medium transition-all"
            >
              <span className="relative z-10 flex items-center">
                Get Started
                <FileText className="ml-2 h-4 w-4" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </Link>
          

        </motion.div>

        {/* Feature Cards with Floating Effects */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <FeatureCard 
            icon={<Target className="h-6 w-6" />}
            title="ATS Optimization"
            description="Smart structuring ensures your resume passes through Applicant Tracking Systems flawlessly."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6" />}
            title="AI Content Writer"
            description="Our Gemini AI rewrites your bullet points using the STAR method for maximum impact."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Sparkles className="h-6 w-6" />}
            title="Premium Aesthetics"
            description="Export to a clean, formal, and weightless design that stands out to recruiters."
            delay={0.6}
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(255,255,255,0.05)" }}
      className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-start text-left"
    >
      <div className="p-3 bg-white/10 rounded-lg text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
