import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { ShieldCheck, Users, Calendar, Mail } from "lucide-react";

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
  const users = await db.collection("users").find().sort({ createdAt: -1 }).toArray();

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <AntigravityBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <ShieldCheck className="h-8 w-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-400">Exclusive access for {session.user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-indigo-400 h-5 w-5" />
              <h2 className="text-lg font-medium">Total Users</h2>
            </div>
            <p className="text-4xl font-bold">{users.length}</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="py-4 px-6 font-semibold text-sm text-gray-300">Email Address</th>
                  <th className="py-4 px-6 font-semibold text-sm text-gray-300">Account ID</th>
                  <th className="py-4 px-6 font-semibold text-sm text-gray-300">Registration Date</th>
                  <th className="py-4 px-6 font-semibold text-sm text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user._id.toString()} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-indigo-400" />
                        </div>
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                      {user._id.toString()}
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(user.createdAt || user.emailVerified).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
