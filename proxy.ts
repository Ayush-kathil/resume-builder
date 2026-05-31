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
        
        // Strictly protect /dashboard and /builder
        if (path.startsWith('/dashboard') || path.startsWith('/builder')) {
          return !!token;
        }
        
        // Allow access to other public or API routes
        return true;
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
