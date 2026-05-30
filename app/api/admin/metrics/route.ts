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
    const logs = await AILog.find().sort({ createdAt: -1 }).limit(100);
    
    const totalTokens = logs.reduce((sum, log) => sum + log.totalTokens, 0);
    const totalCost = logs.reduce((sum, log) => sum + log.costEstimateUSD, 0);
    const flags = logs.filter(log => log.jailbreakFlagged).length;

    return NextResponse.json({
      metrics: {
        totalTokens,
        totalCost,
        flags,
        totalRequests: logs.length
      },
      recentLogs: logs
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
