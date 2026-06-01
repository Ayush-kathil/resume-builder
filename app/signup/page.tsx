'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!email || !email.includes('@')) {
      setEmailExists(null);
      return;
    }

    const checkEmail = async () => {
      try {
        const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          setEmailExists(data.exists);
        }
      } catch (err) {
        console.error('Failed to check email', err);
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
    <div className="min-h-screen w-full flex bg-[#0a0a0a] text-white font-sans">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 xl:p-24 justify-center relative">
        <Link href="/" className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-2 group">
          <div className="flex gap-[2px]">
            <div className="w-1.5 h-4 bg-white rounded-full"></div>
            <div className="w-1.5 h-6 bg-white rounded-full translate-y-[-4px]"></div>
            <div className="w-1.5 h-4 bg-white rounded-full"></div>
          </div>
          <span className="font-playfair text-xl tracking-tight">resume maker</span>
        </Link>

        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl lg:text-5xl font-playfair font-medium tracking-tight mb-12">
            Create account
          </h1>

          <form onSubmit={handleSignup} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Email address</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  disabled={otpSent}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 w-full bg-black border border-[#222] rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white transition-all disabled:opacity-50"
                />
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSubmitting || !email || emailExists === true}
                    className="bg-white text-black font-medium rounded-xl px-4 hover:bg-gray-200 transition-colors disabled:opacity-50 min-w-[80px] flex items-center justify-center"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                  </button>
                ) : (
                  <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center rounded-xl px-4 min-w-[80px]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>
              {emailExists === true && (
                <p className="text-red-400 text-xs mt-1">This email is already registered. Please log in.</p>
              )}
            </div>

            {otpSent && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full tracking-widest bg-black border border-[#222] rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-black border border-[#222] rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-black border border-[#222] rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !otp || !password || !confirmPassword}
                    className="w-full bg-white text-black font-medium rounded-full py-2.5 px-6 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-12 text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:underline transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:flex w-1/2 p-4 lg:p-6">
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
          <Image 
            src="/auth-fluid.png" 
            alt="Abstract fluid gradient" 
            fill 
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
