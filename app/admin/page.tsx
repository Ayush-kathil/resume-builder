import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Security Check: Only allow kathilshiva@gmail.com
  if (!session?.user?.email || session.user.email !== 'kathilshiva@gmail.com') {
    notFound(); // Triggers the custom 404 page
  }

  // Fetch users from MongoDB
  const client = await clientPromise;
  const db = client.db();
  const rawUsers = await db.collection("users").find().sort({ createdAt: -1 }).toArray();
  
  // Serialize ObjectId and Dates for Client Component
  const users = rawUsers.map(user => ({
    _id: user._id.toString(),
    email: user.email,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
    emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : undefined,
    banned: user.banned || false,
  }));
  
  const passcode = process.env.ADMIN_PASSCODE || "0000";

  return <AdminDashboardClient initialUsers={users} adminEmail={session.user.email} expectedPasscode={passcode} />;
}
