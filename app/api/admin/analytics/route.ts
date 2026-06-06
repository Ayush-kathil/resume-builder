import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Security Check: Only allow kathilshiva@gmail.com
    if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const [totalUsers, totalResumes, totalAiLogs] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("resumes").countDocuments(),
      db.collection("ailogs").countDocuments(),
    ]);

    // Group users by creation date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsers = await db.collection("users").countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const metrics = {
      totalUsers,
      newUsers7d: newUsers,
      totalResumes,
      totalAiLogs,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
