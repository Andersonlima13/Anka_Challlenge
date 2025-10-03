// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const publicPaths = ['/login', '/api/auth/login'];
  const isPublic = publicPaths.some(path => req.nextUrl.pathname.startsWith(path));

  const token = req.cookies.get('token')?.value;

  // 1. Se NÃO tiver token e rota for protegida → manda pro login
  if (!token && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Se JÁ tiver token e tentar acessar /login → manda pra home
  if (token && req.nextUrl.pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/usuarios';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// aplica para todas as rotas, menos assets do Next
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
