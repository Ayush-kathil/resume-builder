'use client';

import { motion } from 'framer-motion';
import { AntigravityBackground } from '@/components/ui/AntigravityBackground';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for entry-level candidates looking to build a clean ATS resume.',
      features: ['1 AI Resume Generation', 'Basic Templates', 'PDF Export'],
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/mo',
      description: 'The ultimate toolset for professionals targeting top-tier FAANG companies.',
      features: ['Unlimited AI Generation', 'Premium Templates', 'Word & PDF Export', 'Smart Cover Letters', 'Custom Tone Controls'],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/mo',
      description: 'For agencies and career coaches managing multiple clients.',
      features: ['Everything in Pro', 'Client Management', 'Custom Branding', 'API Access', 'Dedicated Support'],
      highlighted: false,
    }
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col items-center">
      <AntigravityBackground />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" /> Unlock Your Potential
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">Invest in Your Career</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Choose the plan that fits your ambition. Generate world-class resumes in seconds.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -10 }}
              className={`relative bg-black/40 backdrop-blur-xl border rounded-3xl p-8 flex flex-col ${
                plan.highlighted 
                  ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/20 scale-105 z-10' 
                  : 'border-white/10 shadow-xl'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>
              
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                {plan.period && <span className="text-gray-400 font-medium ml-1">{plan.period}</span>}
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${plan.highlighted ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-gray-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
                plan.highlighted 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
              }`}>
                Get Started
              </button>
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
