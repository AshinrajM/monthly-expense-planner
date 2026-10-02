import { NextResponse } from 'next/server';
import { deletePaymentPlan } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deletePaymentPlan(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete payment plan' }, { status: 500 });
  }
}
