import { useState, useEffect, useRef, useCallback } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useSession } from 'next-auth/react';

export type SaveStatus = 'saved' | 'saving' | 'error' | 'idle';

/**
 * Feature #2 (Plan): Debounced Auto-Save Engine.
 * 
 * Fix Crash #14: Stale closure bug fixed by using useRef for resumeId to ensure
 * the save callback always captures the latest ID without triggering re-runs.
 * 
 * Silently saves resume data to MongoDB every 2.5 seconds after any change,
 * without blocking the UI or triggering infinite effect loops.
 */
export function useAutoSave() {
  const data = useResumeStore((state) => state.data);
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const [status, setStatus] = useState<SaveStatus>('idle');

  const isInitialMount = useRef(true);
  // Fix Crash #14: Use a ref for resumeId so the save callback doesn't go stale.
  // Without this, the effect would need resumeId in its dependency array, causing
  // re-runs every time a new ID is created, leading to potential infinite loops.
  const resumeIdRef = useRef<string | null>(null);

  const performSave = useCallback(async () => {
    if (!session?.user?.email) return;

    setStatus('saving');
    try {
      const payload = {
        data,
        email: session.user.email,
        resumeId: resumeIdRef.current,
      };

      const res = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to auto-save');
      }

      const result = await res.json();

      // If this is the first save, capture the newly created resumeId
      // so subsequent saves update the same document instead of creating new ones.
      if (result.resumeId && !resumeIdRef.current) {
        resumeIdRef.current = result.resumeId;
      }

      setStatus('saved');
    } catch (error) {
      console.error('AutoSave Error:', error);
      setStatus('error');
    }
  }, [data, session]); // resumeIdRef is intentionally excluded — refs don't cause re-renders

  useEffect(() => {
    // Skip saving on the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeoutId = setTimeout(performSave, 2500); // 2.5 second debounce

    return () => clearTimeout(timeoutId);
  }, [performSave]);

  return status;
}
