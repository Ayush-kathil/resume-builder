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
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30'
    },
    {
      id: 'modern',
      name: 'Modern Executive',
      description: 'Clean typography with a strong visual hierarchy for leadership roles.',
      tag: 'Premium',
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30'
    },
    {
      id: 'minimalist',
      name: 'Tech Minimalist',
      description: 'Monospaced accents and brutalist layouts for developers and designers.',
      tag: 'Creative',
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col items-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white/5 backdrop-blur-xl border ${tpl.border} rounded-3xl overflow-hidden group cursor-pointer shadow-2xl relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
              
              <div className={`h-64 w-full bg-gradient-to-br ${tpl.color} relative border-b border-white/10 flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                {/* Mockup Preview UI */}
                <div className="w-3/4 h-[120%] bg-white rounded-t-lg shadow-2xl mt-12 p-4 flex flex-col gap-3 rotate-2 group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/3 h-2 bg-gray-100 rounded"></div>
                  <div className="w-full h-[1px] bg-gray-200 my-2"></div>
                  <div className="w-full h-2 bg-gray-100 rounded"></div>
                  <div className="w-5/6 h-2 bg-gray-100 rounded"></div>
                  <div className="w-4/6 h-2 bg-gray-100 rounded"></div>
                </div>
              </div>

              <div className="p-6 relative z-10 bg-black/40 h-full">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-white">{tpl.name}</h3>
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/10 text-white px-3 py-1 rounded-full border border-white/10">
                    {tpl.tag}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {tpl.description}
                </p>
                <button className="w-full py-3 rounded-xl font-medium bg-white/10 text-white hover:bg-white hover:text-black transition-colors border border-white/10">
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
