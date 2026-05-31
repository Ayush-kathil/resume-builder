import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json({ exists: false, error: 'Internal server error' }, { status: 500 });
  }
}
