'use client';

import { useState } from 'react';
import { Mail, Sparkles, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [success, setSuccess] = useState(false);

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
        body: JSON.stringify({ email, type: 'reset' })
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

  const handleResetPassword = async (e: React.FormEvent) => {
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
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Password reset successfully!");
        setSuccess(true);
      } else {
        toast.error(data.error || 'Password reset failed');
      }
    } catch (err) {
      console.error('Reset failed', err);
      toast.error('An error occurred while resetting the password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#fafafa]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 bg-white border border-[#e5e5e5] rounded-3xl shadow-xl z-10 mx-4 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Password Reset Successfully</h2>
          <p className="text-gray-500 text-sm mb-8">
            You can now use your new password to log in to your account.
          </p>
          <Link
            href="/login"
            className="w-full inline-block bg-[#1a1a1a] text-white font-semibold rounded-2xl py-3.5 px-4 hover:bg-black transition-all active:scale-[0.98] shadow-md shadow-black/5"
          >
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#fafafa]">
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md p-8 bg-white border border-[#e5e5e5] rounded-3xl shadow-xl z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">Reset Password</h1>
          <p className="text-gray-500 text-sm text-center">
            Verify your email to set a new password.
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleResetPassword} className="space-y-4">
            
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
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-2xl py-3.5 pl-12 pr-4 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
                />
              </div>
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSubmitting || !email}
                  className="bg-[#1a1a1a] hover:bg-black text-white font-medium rounded-2xl px-4 transition-colors disabled:opacity-50"
                >
                  Verify
                </button>
              ) : (
                <div className="bg-green-50 text-green-600 border border-green-200 flex items-center justify-center rounded-2xl px-4">
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
                    className="w-full text-center tracking-[0.5em] text-xl bg-[#f9f9f9] border border-[#e5e5e5] rounded-2xl py-3.5 px-4 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password (min 8 chars)"
                    className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-2xl py-3.5 pl-12 pr-4 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-2xl py-3.5 pl-12 pr-4 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !otp || !password || !confirmPassword}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl py-3.5 px-4 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/25 mt-2"
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </motion.div>
            )}
          </form>
          
          <div className="text-center mt-6">
            <Link href="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a1a1a] text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
