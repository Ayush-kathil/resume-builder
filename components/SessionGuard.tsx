'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password', '/pricing'];

/**
 * SessionGuard — Fix Crash #18: JWT Expiration Unhandled.
 * 
 * When a user's session expires, API calls return 401. Without this guard,
 * the UI silently fails or crashes in cascading ways. This component monitors
 * the session status and redirects to /login as soon as the session becomes
 * unauthenticated while on a protected route.
 */
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if unauthenticated AND on a protected route
    if (status === 'unauthenticated') {
      const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + '/')
      );
      if (!isPublicRoute) {
        // Session expired — redirect to login with a return URL
        const returnUrl = encodeURIComponent(pathname);
        router.replace(`/login?expired=true&returnTo=${returnUrl}`);
      }
    }
  }, [status, pathname, router]);

  return <>{children}</>;
}
