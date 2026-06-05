'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        window.location.href = '/welcome';
      }
    } catch (error) {
      console.error('Password login failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-[#1a1a1a] font-sans">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 xl:p-24 justify-center relative">
        <Link href="/" className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-2 group">
          <div className="flex gap-[2px]">
            <div className="w-1.5 h-4 bg-[#1a1a1a] rounded-full"></div>
            <div className="w-1.5 h-6 bg-[#1a1a1a] rounded-full translate-y-[-4px]"></div>
            <div className="w-1.5 h-4 bg-[#1a1a1a] rounded-full"></div>
          </div>
          <span className="font-playfair text-xl tracking-tight text-[#1a1a1a]">resume maker</span>
        </Link>

        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl lg:text-5xl font-playfair font-medium tracking-tight mb-12">
            Sign in
          </h1>

          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl py-3 px-4 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
              />
              {emailExists === false && email.includes('@') && (
                <p className="text-red-500 text-xs mt-1">Account not found. Please sign up first.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl py-3 px-4 text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !email || !password || emailExists === false}
                className="bg-[#1a1a1a] text-white font-medium rounded-full py-2.5 px-6 hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : 'Sign in'}
              </button>
              
              <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors">
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="mt-12 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#1a1a1a] font-medium hover:underline transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:flex w-1/2 p-4 lg:p-6">
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#f9f9f9] border border-[#e5e5e5]">
          <Image 
            src="/auth-fluid.png" 
            alt="Abstract fluid gradient" 
            fill 
            className="object-cover opacity-80"
            priority
          />
        </div>
      </div>
    </div>
  );
}
