import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Resume } from '@/models/Resume';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { email, resumeId, title, data, isPublic } = await req.json();

    if (!data) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    await connectToDatabase();

    let ownerId = undefined;

    // If an email is provided, associate this resume with a User
    if (email) {
      let user = await User.findOne({ email });
      if (!user) {
        // Create user if they don't exist (Guest flow or future Auth flow)
        user = await User.create({ email });
      }
      ownerId = user._id;
    }

    let resume;

    if (resumeId) {
      // Update existing resume
      resume = await Resume.findByIdAndUpdate(
        resumeId,
        {
          title: title || 'Untitled Resume',
          isPublic: isPublic ?? false,
          data,
          ownerId
        },
        { new: true }
      );
      
      if (!resume) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }
    } else {
      // Create new resume
      resume = await Resume.create({
        title: title || 'Untitled Resume',
        isPublic: isPublic ?? false,
        data,
        ownerId
      });

      // Link to user
      if (ownerId) {
        await User.findByIdAndUpdate(ownerId, {
          $push: { resumeIds: resume._id }
        });
      }
    }

    return NextResponse.json({ success: true, resumeId: resume._id });
  } catch (error: any) {
    console.error('Resume save error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save resume' }, { status: 500 });
  }
}
