import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { PromptVersion } from '@/models/PromptVersion';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await clientPromise;

  try {
    const prompts = await PromptVersion.find().sort({ updatedAt: -1 });
    return NextResponse.json(prompts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await clientPromise;

  try {
    const { name, content, notes, isActive } = await req.json();

    // Find latest version
    const latest = await PromptVersion.findOne({ name }).sort({ version: -1 });
    const version = latest ? latest.version + 1 : 1;

    // If this one is set to active, deactivate all others with the same name
    if (isActive) {
      await PromptVersion.updateMany({ name }, { isActive: false });
    }

    const prompt = await PromptVersion.create({
      name,
      version,
      content,
      isActive: isActive || false,
      createdBy: session.user.email,
      notes,
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
  }
}
