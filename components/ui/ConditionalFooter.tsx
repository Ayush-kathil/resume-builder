'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

/**
 * Renders the Footer on all pages EXCEPT full-screen app views
 * like the Builder or Admin dashboard, which manage their own layouts.
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on these routes to prevent overlapping with bottom-fixed navs or h-screen layouts
  const isHiddenRoute = pathname?.startsWith('/builder') || pathname?.startsWith('/admin');

  if (isHiddenRoute) return null;

  return <Footer />;
}
