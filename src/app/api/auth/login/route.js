import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const isValidUser = (username === 'admin' && password === '1234') || 
                        (username === 'ashinrajeevan98_db_user' && password === 'lSjgFFN2KKI9eXbK');

    if (isValidUser) {
      const cookieStore = await cookies();
      cookieStore.set('auth_token', 'authenticated_user_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json({ success: true, message: 'Authenticated successfully' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error during login' },
      { status: 500 }
    );
  }
}
