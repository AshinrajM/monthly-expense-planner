import { NextResponse } from 'next/server';
import { connectToDatabase, getLastDbError } from '@/lib/mongoose';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({
      connected: false,
      hasUri: false,
      message: 'MONGODB_URI environment variable is missing on Vercel.',
      actionRequired: 'Add MONGODB_URI in Vercel Project Settings -> Environment Variables and click Redeploy.'
    }, { status: 500 });
  }

  try {
    const conn = await connectToDatabase();
    if (conn) {
      return NextResponse.json({
        connected: true,
        hasUri: true,
        readyState: conn.connection.readyState,
        dbName: conn.connection.name,
        message: 'Successfully connected to MongoDB Atlas.'
      });
    } else {
      const lastErr = getLastDbError();
      return NextResponse.json({
        connected: false,
        hasUri: true,
        error: lastErr,
        message: lastErr ? `MongoDB Atlas Error: ${lastErr}` : 'Could not establish connection to MongoDB Atlas.',
        actionRequired: 'Check MongoDB Atlas Network Access (IP Access List) and ensure 0.0.0.0/0 is allowed.'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      connected: false,
      hasUri: true,
      error: error.message,
      message: `Failed to connect to MongoDB Atlas: ${error.message}`,
      actionRequired: 'Ensure 0.0.0.0/0 (Allow access from anywhere) is enabled under Network Access in MongoDB Atlas.'
    }, { status: 500 });
  }
}
