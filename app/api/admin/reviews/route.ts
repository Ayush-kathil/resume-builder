import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { AILog } from '@/models/AILog';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await clientPromise;

  try {
    const reviews = await AILog.find({ needsReview: true })
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(50);
    
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await clientPromise;

  try {
    const { logId, action } = await req.json();

    if (action === 'approve' || action === 'reject') {
      const log = await AILog.findByIdAndUpdate(
        logId,
        { needsReview: false },
        { new: true }
      );
      return NextResponse.json(log);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
