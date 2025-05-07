import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const isAuthenticated = req.cookies.get('admin_session')?.value === 'true';

  return NextResponse.json({ authenticated: isAuthenticated }, { status: isAuthenticated ? 200 : 401 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ authenticated: true });

    response.cookies.set('admin_session', 'true', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 0,
  });

  return response;
}