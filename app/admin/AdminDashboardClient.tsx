"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Mail, 
  Trash2, 
  CreditCard, 
  Bot, 
  BarChart3, 
  Library, 
  LifeBuoy, 
  Settings,
  Activity,
  LogOut,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Crown,
  Lock,
  KeyRound
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PromptIDE from "./PromptIDE";
import CostControls from "./CostControls";
import HumanReview from "./HumanReview";

type User = {
  _id: string;
  email: string;
  createdAt?: string;
  emailVerified?: string;
};

export default function AdminDashboardClient({ 
  initialUsers, 
  adminEmail,
  expectedPasscode = "0000"
}: { 
  initialUsers: User[];
  adminEmail: string;
  expectedPasscode?: string;
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activeTab, setActiveTab] = useState("users");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Lock Screen State
  const [isLocked, setIsLocked] = useState(true);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [lockError, setLockError] = useState(false);

  const router = useRouter();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === expectedPasscode) {
      setIsLocked(false);
      setLockError(false);
    } else {
      setLockError(true);
      setPasscodeInput("");
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}? They will have to re-signup next time.`)) {
      return;
    }

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        alert('User deleted successfully.');
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Failed to delete user: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the user.');
    } finally {
      setIsDeleting(null);
    }
  };

  const tabs = [
    { id: "users", name: "User Directory", icon: Users },
    { id: "security", name: "Security & Abuse", icon: ShieldCheck },
    { id: "cost_controls", name: "Cost Controls", icon: CreditCard },
    { id: "prompt_ide", name: "Prompt IDE", icon: Bot },
    { id: "human_review", name: "Human Review", icon: AlertCircle },
    { id: "analytics", name: "Analytics & Insights", icon: BarChart3 },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  if (isLocked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F2F1ED] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-[#F2F1ED]">
        <div className="w-full max-w-md p-8 bg-white border border-[#e5e5e5] rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-[#F2F1ED] rounded-2xl flex items-center justify-center border border-[#e5e5e5] mb-6 shadow-sm">
              <Lock className="h-8 w-8 text-[#1a1a1a]" />
            </div>
            
            <h1 className="text-2xl font-playfair font-medium text-[#1a1a1a] mb-2 tracking-tight">Admin Locked</h1>
            <p className="text-gray-500 text-sm mb-8">Enter your 4-digit passcode to access the enterprise dashboard.</p>
            
            <form onSubmit={handleUnlock} className="w-full">
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  maxLength={4}
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    setLockError(false);
                  }}
                  className={`w-full bg-white border ${lockError ? 'border-red-500 focus:ring-red-500' : 'border-[#e5e5e5] focus:ring-black'} rounded-xl py-3 pl-10 pr-4 text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:ring-1 transition-all text-center tracking-[1em] text-lg font-mono`}
                  placeholder="••••"
                  autoFocus
                />
              </div>
              
              {lockError && (
                <p className="text-red-500 text-xs mb-4 text-center">Incorrect passcode. Try again.</p>
              )}
              
              <button
                type="submit"
                disabled={passcodeInput.length !== 4}
                className="w-full bg-[#1a1a1a] hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3 rounded-full transition-colors"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F2F1ED] text-[#1a1a1a] overflow-hidden font-sans selection:bg-[#1a1a1a] selection:text-[#F2F1ED]">
      
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-[#e5e5e5] flex flex-col">
        <div className="p-6 border-b border-[#e5e5e5] flex items-center gap-3">
          <div className="h-10 w-10 bg-[#F2F1ED] rounded-xl flex items-center justify-center border border-[#e5e5e5]">
            <ShieldCheck className="h-6 w-6 text-[#1a1a1a]" />
          </div>
          <div>
            <h2 className="font-playfair font-medium text-lg text-[#1a1a1a] leading-tight">Admin<span className="font-bold">Panel</span></h2>
            <p className="text-xs text-gray-500">Enterprise Dashboard</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? "bg-[#1a1a1a] text-white" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#1a1a1a]"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-[#e5e5e5]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 border border-[#e5e5e5]">
            {/* Proper Admin Circular Icon */}
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 p-[2px] shadow-sm shrink-0">
              <div className="h-full w-full bg-white rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-gray-700" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-[#1a1a1a] truncate">Super Admin</p>
              <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#F2F1ED] relative">
        <div className="p-8 max-w-7xl mx-auto">
          
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair font-medium text-[#1a1a1a] tracking-tight">{tabs.find(t => t.id === activeTab)?.name}</h1>
              <p className="text-gray-500 text-sm mt-1">Manage and monitor your enterprise settings.</p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-green-700">System Operational</span>
            </div>
          </div>

          {/* Tab Content: Users */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2 text-gray-500">
                    <Users className="h-5 w-5 text-[#1a1a1a]" />
                    <h2 className="text-sm font-medium">Total Active Users</h2>
                  </div>
                  <p className="text-3xl font-playfair font-medium text-[#1a1a1a]">{users.length}</p>
                </div>
                <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2 text-gray-500">
                    <Activity className="h-5 w-5 text-[#1a1a1a]" />
                    <h2 className="text-sm font-medium">New Signups (7d)</h2>
                  </div>
                  <p className="text-3xl font-playfair font-medium text-[#1a1a1a]">+{Math.min(12, users.length)}</p>
                </div>
              </div>

              <div className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#e5e5e5] flex justify-between items-center bg-white">
                  <h3 className="font-semibold text-[#1a1a1a]">User Directory</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[#e5e5e5]">
                        <th className="py-3 px-6 font-medium text-xs text-[#71717a] uppercase tracking-wider">User</th>
                        <th className="py-3 px-6 font-medium text-xs text-[#71717a] uppercase tracking-wider">Account ID</th>
                        <th className="py-3 px-6 font-medium text-xs text-[#71717a] uppercase tracking-wider">Joined</th>
                        <th className="py-3 px-6 font-medium text-xs text-[#71717a] uppercase tracking-wider">Status</th>
                        <th className="py-3 px-6 font-medium text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e5e5]">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">No users found.</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-6">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-[#F2F1ED] flex items-center justify-center text-xs font-bold border border-[#e5e5e5] text-[#1a1a1a]">
                                  {user.email.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-sm text-[#1a1a1a]">{user.email}</div>
                                  <div className="text-xs text-gray-500">Freemium Plan</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-6 text-gray-500 font-mono text-xs">
                              {user._id}
                            </td>
                            <td className="py-3 px-6 text-gray-500 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {new Date(user.createdAt || user.emailVerified || Date.now()).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-3 px-6">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-6 text-right">
                              <button
                                onClick={() => handleDeleteUser(user._id, user.email)}
                                disabled={isDeleting === user._id}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                                title="Delete User (Force Re-signup)"
                              >
                                {isDeleting === user._id ? (
                                  <div className="h-3 w-3 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Prompt IDE */}
          {activeTab === "prompt_ide" && (
            <div className="h-[calc(100vh-140px)]">
              <PromptIDE />
            </div>
          )}

          {/* Tab Content: Cost Controls */}
          {activeTab === "cost_controls" && (
            <div className="h-[calc(100vh-140px)]">
              <CostControls />
            </div>
          )}

          {/* Tab Content: Human Review */}
          {activeTab === "human_review" && (
            <div className="h-[calc(100vh-140px)]">
              <HumanReview />
            </div>
          )}

          {/* Tab Content: Mocked/Coming Soon Tabs */}
          {activeTab !== "users" && activeTab !== "prompt_ide" && activeTab !== "cost_controls" && activeTab !== "human_review" && (
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-12 text-center shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
              <div className="mx-auto w-16 h-16 bg-[#F2F1ED] rounded-2xl flex items-center justify-center border border-[#e5e5e5] mb-4 shadow-sm">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-playfair font-medium text-[#1a1a1a] mb-2 tracking-tight">Coming Soon</h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed mb-6">
                The <strong className="text-[#1a1a1a]">{tabs.find(t => t.id === activeTab)?.name}</strong> module is currently under development. Real-time integrations, dashboards, and configurations will be available in the next major update.
              </p>
              <button onClick={() => setActiveTab("users")} className="px-4 py-2 bg-white hover:bg-gray-50 text-sm text-[#1a1a1a] font-medium rounded-lg transition-colors border border-[#e5e5e5] shadow-sm">
                Return to Directory
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
