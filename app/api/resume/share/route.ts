import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { SharedResume } from '@/lib/models/SharedResume';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { data, password } = await req.json();

    if (!data) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Generate unique slug (8 chars)
    const slug = crypto.randomBytes(4).toString('hex');
    
    let passwordHash = undefined;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const newSharedResume = new SharedResume({
      slug,
      data,
      passwordHash,
    });

    await newSharedResume.save();

    return NextResponse.json({ 
      success: true, 
      slug,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/resume/${slug}`
    });

  } catch (error: any) {
    console.error('Error creating shared resume:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
