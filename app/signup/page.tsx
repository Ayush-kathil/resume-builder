'use client';

import { useState, useEffect } from 'react';
import { AntigravityBackground } from '@/components/ui/AntigravityBackground';
import { Mail, Sparkles, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    if (!email || !email.includes('@')) {
      setEmailExists(null);
      setIsCheckingEmail(false);
      return;
    }

    const checkEmail = async () => {
      setIsCheckingEmail(true);
      try {
        const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          setEmailExists(data.exists);
        }
      } catch (err) {
        console.error('Failed to check email', err);
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const debounceId = setTimeout(checkEmail, 500);
    return () => clearTimeout(debounceId);
  }, [email]);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'signup' })
      });
      if (res.ok) {
        setOtpSent(true);
        toast.success("Verification code sent!");
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      console.error('OTP request failed', err);
      toast.error('An error occurred while sending the verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Account created successfully!");
        window.location.href = '/login?registered=true';
      } else {
        toast.error(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup failed', err);
      toast.error('An error occurred during signup.');
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
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm text-center">
            Verify your email and set a secure password.
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSignup} className="space-y-4">
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  disabled={otpSent}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isCheckingEmail ? (
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                  ) : emailExists === true ? (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  ) : emailExists === false && !otpSent ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : null}
                </div>
              </div>
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSubmitting || !email || emailExists === true}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-2xl px-4 transition-colors disabled:opacity-50"
                >
                  Verify
                </button>
              ) : (
                <div className="bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center rounded-2xl px-4">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {emailExists === true && !isCheckingEmail && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs px-2"
                >
                  This email is already registered. Please log in instead.
                </motion.p>
              )}
            </AnimatePresence>

            {otpSent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div className="relative flex justify-center">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-center tracking-[0.5em] text-xl bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min 8 chars)"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !otp || !password || !confirmPassword}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl py-3.5 px-4 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/25 mt-2"
                >
                  {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </button>
              </motion.div>
            )}
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
