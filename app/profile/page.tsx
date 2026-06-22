"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, AlertTriangle, KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F1ED]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a]" />
      </div>
    );
  }

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUpdatingName(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      
      await update({ name });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success('Password changed successfully. Security email sent.');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!confirmDeleteStep) {
      setConfirmDeleteStep(true);
      return;
    }

    setIsDeleting(true);
    toast.loading('Sending verification code to your email...', { id: 'delete-req' });

    try {
      const res = await fetch('/api/user/delete-account/request', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success('Verification code sent!', { id: 'delete-req' });
      setShowOtpModal(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to request deletion', { id: 'delete-req' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVerifyDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsVerifyingOtp(true);
    try {
      const res = await fetch('/api/user/delete-account/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success('Account successfully deleted.');
      setShowOtpModal(false);
      setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F1ED] font-sans text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-500 hover:text-[#1a1a1a] transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Account Settings</h1>
          <p className="text-sm text-gray-500">Manage your profile, security, and preferences.</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8 mt-6">
        
        {/* Personal Info Section */}
        <section className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[#e5e5e5] flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Personal Information</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed">
                <Mail className="w-4 h-4" />
                {session?.user?.email}
              </div>
              <p className="text-xs text-gray-400 mt-2">Email address cannot be changed once registered.</p>
            </div>

            <form onSubmit={handleUpdateName}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent transition-all mb-4"
              />
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isUpdatingName || !name.trim()}
                  className="px-5 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdatingName && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[#e5e5e5] flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium">Security & Password</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    minLength={8}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  type="submit" 
                  disabled={isChangingPassword || !oldPassword || !newPassword || newPassword.length < 8}
                  className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50/50 border border-red-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-red-200 flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-medium text-red-900">Danger Zone</h2>
          </div>
          
          <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-medium text-red-900 mb-1">Delete Account</h3>
              <p className="text-sm text-red-700/80">
                Permanently remove your personal account and all of its contents from our servers. This action is not reversible.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button 
                onClick={handleRequestDeletion}
                disabled={isDeleting}
                className={`px-5 py-2.5 text-white text-sm font-medium rounded-xl transition-colors shrink-0 flex items-center gap-2 shadow-sm ${
                  confirmDeleteStep ? 'bg-red-800 hover:bg-red-900 shadow-red-900/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                }`}
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmDeleteStep ? 'Are you sure? Click to confirm' : 'Delete Account'}
              </button>
              {confirmDeleteStep && (
                <button onClick={() => setConfirmDeleteStep(false)} className="text-xs text-gray-500 hover:underline">
                  Cancel deletion
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowOtpModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 mx-auto mt-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl font-bold text-center mb-2">Verify Deletion</h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              We've sent a 6-digit verification code to <span className="font-medium text-gray-900">{session?.user?.email}</span>. Enter it below to confirm account deletion.
            </p>

            <form onSubmit={handleVerifyDeletion}>
              <input 
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="w-full text-center tracking-[0.5em] placeholder:tracking-normal text-2xl font-mono px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all mb-6 uppercase"
                required
              />

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isVerifyingOtp || otp.length < 6}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-red-600/20"
                >
                  {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Deletion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
