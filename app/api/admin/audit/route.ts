import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { AuditLog } from "@/models/AuditLog";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Security Check: Only allow kathilshiva@gmail.com
    if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        family: 4,
        serverSelectionTimeoutMS: 5000,
      });
    }

    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(100).lean();

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Audit fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
