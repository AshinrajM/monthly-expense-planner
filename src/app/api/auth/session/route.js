import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    const isAuthenticated = token?.value === 'authenticated_user_session';

    return NextResponse.json({ isAuthenticated });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
}
