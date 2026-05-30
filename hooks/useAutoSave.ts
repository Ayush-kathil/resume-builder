import { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useSession } from 'next-auth/react';

export type SaveStatus = 'saved' | 'saving' | 'error';

export function useAutoSave() {
  const data = useResumeStore((state) => state.data);
  const { data: session } = useSession();
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [resumeId, setResumeId] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip saving on the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setStatus('saving');

    const timeoutId = setTimeout(async () => {
      try {
        const payload = {
          data,
          email: session?.user?.email,
          resumeId: resumeId,
        };

        const res = await fetch('/api/resume/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Failed to auto-save');

        const result = await res.json();
        
        // If this is the first save, capture the newly created resumeId
        // so subsequent saves update the same document instead of creating new ones.
        if (result.resumeId && !resumeId) {
          setResumeId(result.resumeId);
        }

        setStatus('saved');
      } catch (error) {
        console.error('AutoSave Error:', error);
        setStatus('error');
      }
    }, 2500); // 2.5 second debounce

    return () => clearTimeout(timeoutId);
  }, [data, session, resumeId]);

  return status;
}
