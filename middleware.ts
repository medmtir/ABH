import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  // Protect /admin/dashboard and any sub-routes
  if (pathname.startsWith('/admin/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Basic structure check for JWT (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // If already logged in and visiting /admin/login, redirect to dashboard
  if (pathname === '/admin/login') {
    if (token && token.split('.').length === 3) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
