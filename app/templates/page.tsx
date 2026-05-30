'use client';

import { motion } from 'framer-motion';
import { AntigravityBackground } from '@/components/ui/AntigravityBackground';
import { Sparkles, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TemplatesPage() {
  const templates = [
    {
      id: 'classic',
      name: 'Classic ATS',
      description: 'The golden standard. Highly readable, strictly optimized for parsing engines.',
      tag: 'FAANG Favorite',
      image: '/templates/tpl_classic_1780139114043.png'
    },
    {
      id: 'modern',
      name: 'Modern Executive',
      description: 'Clean typography with a strong visual hierarchy for leadership roles.',
      tag: 'Premium',
      image: '/templates/tpl_modern_1780139131092.png'
    },
    {
      id: 'minimalist',
      name: 'Tech Minimalist',
      description: 'Monospaced accents and brutalist layouts for developers and designers.',
      tag: 'Creative',
      image: '/templates/tpl_minimal_1780139148799.png'
    },
    {
      id: 'creative',
      name: 'Creative Designer',
      description: 'Bold typography, asymmetric layout, vibrant yellow accent color.',
      tag: 'Vibrant',
      image: '/templates/tpl_creative_1780139174816.png'
    },
    {
      id: 'academic',
      name: 'Academic CV',
      description: 'Traditional, dense text, very formal serif font for research roles.',
      tag: 'Formal',
      image: '/templates/tpl_academic_1780139191564.png'
    },
    {
      id: 'medical',
      name: 'Medical Professional',
      description: 'Clean, soft blue accents, highly structured for healthcare workers.',
      tag: 'Structured',
      image: '/templates/tpl_medical_1780139208475.png'
    },
    {
      id: 'startup',
      name: 'Startup Founder',
      description: 'Dark mode, neon purple accents, highly modern and edgy.',
      tag: 'Edgy',
      image: '/templates/tpl_startup_1780139233213.png'
    },
    {
      id: 'finance',
      name: 'Investment Banker',
      description: 'Extremely conservative, strict grid alignment for corporate roles.',
      tag: 'Conservative',
      image: '/templates/tpl_finance_1780139249312.png'
    },
    {
      id: 'graduate',
      name: 'Recent Graduate',
      description: 'Two columns, soft green accents, emphasis on education and projects.',
      tag: 'Entry Level',
      image: '/templates/tpl_graduate_1780139269205.png'
    },
    {
      id: 'portfolio',
      name: 'Visual Portfolio',
      description: 'Large header area, grid layout for projects, highly visual.',
      tag: 'Showcase',
      image: '/templates/tpl_portfolio_1780139291427.png'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col items-center pb-32">
      <AntigravityBackground />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <LayoutTemplate className="h-4 w-4" /> Architecture Gallery
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">World-Class Templates</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Every design is rigorously tested against top applicant tracking systems. Choose your weapon.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 10) * 0.05, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group cursor-pointer shadow-2xl relative flex flex-col`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
              
              <div className={`h-64 w-full relative border-b border-white/10 overflow-hidden bg-black/50`}>
                <Image
                  src={tpl.image}
                  alt={tpl.name}
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="p-6 relative z-10 bg-black/40 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{tpl.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white px-2 py-1 rounded-md border border-white/10 whitespace-nowrap ml-2">
                      {tpl.tag}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {tpl.description}
                  </p>
                </div>
                <button className="w-full py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white hover:text-black transition-colors border border-white/10 mt-auto">
                  Select Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors underline decoration-white/30 underline-offset-4">
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
