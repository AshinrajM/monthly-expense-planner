import { NextResponse } from 'next/server';
import { getPaymentPlans, savePaymentPlan } from '@/lib/db';

export async function GET() {
  try {
    const plans = await getPaymentPlans();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payment plans' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.totalAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newPlan = await savePaymentPlan(body);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save payment plan' }, { status: 500 });
  }
}
