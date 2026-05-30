import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { SharedResume } from '@/lib/models/SharedResume';
import bcrypt from 'bcryptjs';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    
    const resume = await SharedResume.findOne({ slug });
    
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (resume.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Resume link has expired' }, { status: 410 });
    }

    if (resume.passwordHash) {
      return NextResponse.json({ isProtected: true });
    }

    // Increment views if public
    resume.views += 1;
    await resume.save();

    return NextResponse.json({ success: true, data: resume.data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const resume = await SharedResume.findOne({ slug });
    
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (resume.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Resume link has expired' }, { status: 410 });
    }

    if (!resume.passwordHash) {
       // Increment views
      resume.views += 1;
      await resume.save();
      return NextResponse.json({ success: true, data: resume.data });
    }

    const isMatch = await bcrypt.compare(password, resume.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Increment views
    resume.views += 1;
    await resume.save();

    return NextResponse.json({ success: true, data: resume.data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
