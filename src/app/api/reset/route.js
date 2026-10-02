import { NextResponse } from 'next/server';
import { clearAllData } from '@/lib/db';

export async function POST() {
  try {
    await clearAllData();
    return NextResponse.json({ success: true, message: 'All data cleared successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 });
  }
}
