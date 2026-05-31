'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { AntigravityBackground } from '@/components/ui/AntigravityBackground';
import { Mail, Sparkles, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await signIn('password', { 
        email, 
        password, 
        redirect: false 
      });
      
      if (res?.error) {
        alert("Invalid email or password");
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Password login failed', error);
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
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm text-center">
            Enter your email and password to log in.
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isCheckingEmail ? (
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                ) : emailExists === false ? (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                ) : null}
              </div>
            </div>
            
            <AnimatePresence>
              {emailExists === false && !isCheckingEmail && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs px-2"
                >
                  Account not found. Please sign up first.
                </motion.p>
              )}
            </AnimatePresence>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !email || !password || emailExists === false}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl py-3.5 px-4 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/25 mt-2"
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
            
            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors">
                Forgot Password?
              </Link>
            </div>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
