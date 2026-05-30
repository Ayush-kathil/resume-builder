'use client';

import { useState } from 'react';
import { AntigravityBackground } from '@/components/ui/AntigravityBackground';
import { Mail, Sparkles, KeyRound, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email first.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setOtpSent(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      console.error('OTP request failed', err);
      setError('An error occurred while sending the verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Successful signup logs them in directly in the API or we can redirect to login
        // Let's redirect to login page with a success message
        window.location.href = '/login?registered=true';
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup failed', err);
      setError('An error occurred during signup.');
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

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

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
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
                />
              </div>
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSubmitting || !email}
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
