import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Return NextResponse.next() to continue the request
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        
        // Public paths that do not require authentication
        const publicPaths = ['/', '/login', '/signup', '/forgot-password'];
        
        // Allow access to public paths
        if (publicPaths.includes(path) || path.startsWith('/api/')) {
          return true;
        }

        // Require token for all other paths
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    }
  }
);

// Apply middleware to all routes except Next.js internals and static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
