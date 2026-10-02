import { NextResponse } from 'next/server';
import { getMonthlyStatuses, saveMonthlyStatuses } from '@/lib/db';

export async function GET() {
  try {
    const statuses = await getMonthlyStatuses();
    return NextResponse.json(statuses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch statuses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const statuses = await request.json();
    const updated = await saveMonthlyStatuses(statuses);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save statuses' }, { status: 500 });
  }
}
