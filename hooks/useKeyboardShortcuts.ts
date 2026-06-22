import { useEffect } from 'react';
import { useResumeStore } from '@/store/resumeStore';

export function useKeyboardShortcuts() {
  const { undo, redo } = useResumeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in a standard input/textarea
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName === 'INPUT' || 
        activeElement?.tagName === 'TEXTAREA' || 
        (activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Cmd/Ctrl + Z -> Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Cmd/Ctrl + Shift + Z OR Cmd/Ctrl + Y -> Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);
}
