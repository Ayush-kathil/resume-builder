'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { AntigravityBackground } from '@/components/ui/AntigravityBackground';
import { Mail, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setStep(2);
      } else {
        const data = await res.json();
        console.error('Failed to send OTP:', data.error);
        alert(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP request failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await signIn('credentials', { 
        email, 
        otp, 
        redirect: false 
      });
      
      if (res?.error) {
        alert(res.error);
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('OTP verification failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-transparent">
      <AntigravityBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm text-center">
            {step === 1 ? 'Enter your email to receive a secure login code.' : 'Enter the 6-digit code sent to your email.'}
          </p>
        </div>

        <div className="space-y-6">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl py-3.5 px-4 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/25"
              >
                {isSubmitting ? 'Sending Code...' : 'Send Login Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative flex justify-center">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-[0.5em] text-2xl bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || otp.length < 6}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl py-3.5 px-4 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/25"
              >
                {isSubmitting ? 'Verifying...' : 'Verify Code'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-400 hover:text-white transition-colors"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
