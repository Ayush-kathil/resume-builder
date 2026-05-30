import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateAIContent } from '@/lib/ai/gateway';
import clientPromise from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await clientPromise;

  try {
    const { promptContent, promptName } = await req.json();

    // Fetch admin user ID to pass to gateway
    const adminUser = await User.findOne({ email: session.user.email });
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found in DB' }, { status: 404 });
    }

    const response = await generateAIContent({
      userId: adminUser._id.toString(),
      promptContent,
      endpoint: 'playground',
      promptName: promptName || 'Playground Test',
    });

    if (response.error) {
      return NextResponse.json({ error: response.error, flagged: response.flagged }, { status: 400 });
    }

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Playground execution failed' }, { status: 500 });
  }
}
