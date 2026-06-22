import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { AuditLog } from '@/models/AuditLog';

// Fix Crash #6: Validate ObjectId before using it to prevent Mongoose crashes on invalid IDs.
function isValidObjectId(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Security Check: Only allow kathilshiva@gmail.com
    if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fix Crash #6: Validate ObjectId format before querying MongoDB
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Delete the user
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Record Audit Log
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await AuditLog.create({
      action: "USER_DELETE",
      adminEmail: session.user.email,
      target: id,
      details: "Force deleted user from User Directory",
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Security Check: Only allow kathilshiva@gmail.com
    if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fix Crash #6: Validate ObjectId format before querying MongoDB
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { banned } = body;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { banned } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await AuditLog.create({
      action: banned ? "USER_BAN" : "USER_UNBAN",
      adminEmail: session.user.email,
      target: id,
      details: `${banned ? 'Banned' : 'Unbanned'} user from Security module`,
      ipAddress: ip,
    });

    return NextResponse.json({ success: true, banned });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
