import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Briefcase, RefreshCw, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { toast } from 'sonner';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SyncModal({ isOpen, onClose }: SyncModalProps) {
  const { data } = useResumeStore();
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [syncedProviders, setSyncedProviders] = useState<string[]>([]);

  const handleSync = async (provider: string) => {
    setSyncingProvider(provider);
    
    // Simulate OAuth flow & network request
    setTimeout(async () => {
      try {
        const res = await fetch('/api/resume/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider, data })
        });
        
        if (!res.ok) throw new Error('Sync failed');
        
        setSyncedProviders(prev => [...prev, provider]);
        toast.success(`Successfully synced profile to ${provider}!`);
      } catch (err) {
        toast.error(`Failed to sync with ${provider}.`);
      } finally {
        setSyncingProvider(null);
      }
    }, 2500);
  };

  const providers = [
    { id: 'LinkedIn', icon: <Globe className="w-6 h-6 text-[#0077b5]" />, color: 'hover:border-[#0077b5]/50' },
    { id: 'Indeed', icon: <Briefcase className="w-6 h-6 text-[#2164f4]" />, color: 'hover:border-[#2164f4]/50' },
    { id: 'ZipRecruiter', icon: <Briefcase className="w-6 h-6 text-[#12b339]" />, color: 'hover:border-[#12b339]/50' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-lg bg-[#09090b] border border-white/20 rounded-2xl shadow-2xl p-6 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Job Board Sync</h2>
              <p className="text-sm text-gray-400">Push your updated resume structured data directly to external job boards.</p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-6 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-200 leading-relaxed">
                <strong>Demo Mode:</strong> We are running in a simulated environment. Clicking sync will mock an OAuth flow and structured data payload transfer, bypassing the need for live enterprise API credentials.
              </p>
            </div>

            <div className="space-y-3">
              {providers.map((p) => {
                const isSyncing = syncingProvider === p.id;
                const isSynced = syncedProviders.includes(p.id);

                return (
                  <button
                    key={p.id}
                    onClick={() => handleSync(p.id)}
                    disabled={isSyncing || isSynced || (syncingProvider !== null && syncingProvider !== p.id)}
                    className={`w-full flex items-center justify-between p-4 bg-white/5 border rounded-xl transition-all ${
                      isSynced ? 'border-emerald-500/50 bg-emerald-500/5' : `border-white/10 ${p.color}`
                    } disabled:opacity-50 disabled:cursor-not-allowed group`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        {p.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white">{p.id}</div>
                        <div className="text-[11px] text-gray-400">
                          {isSynced ? 'Synced successfully' : 'Update profile data'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {isSyncing ? (
                        <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : isSynced ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
