"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Users, FileText, Zap } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashTab() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!metrics) {
    return <div>Failed to load analytics data.</div>;
  }

  // Mock data for the charts since we don't have historical timeseries data yet
  const userGrowthData = [
    { name: 'Mon', users: Math.floor(metrics.totalUsers * 0.5) },
    { name: 'Tue', users: Math.floor(metrics.totalUsers * 0.6) },
    { name: 'Wed', users: Math.floor(metrics.totalUsers * 0.7) },
    { name: 'Thu', users: Math.floor(metrics.totalUsers * 0.8) },
    { name: 'Fri', users: Math.floor(metrics.totalUsers * 0.9) },
    { name: 'Sat', users: Math.floor(metrics.totalUsers * 0.95) },
    { name: 'Sun', users: metrics.totalUsers },
  ];

  const aiUsageData = [
    { name: 'Rewrite', tokens: Math.floor(metrics.totalAiLogs * 100) },
    { name: 'Summary', tokens: Math.floor(metrics.totalAiLogs * 150) },
    { name: 'Chat', tokens: Math.floor(metrics.totalAiLogs * 50) },
    { name: 'Suggest', tokens: Math.floor(metrics.totalAiLogs * 80) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{metrics.newUsers7d} in 7d
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Registered Users</h3>
          <p className="text-3xl font-playfair font-medium text-[#1a1a1a]">{metrics.totalUsers}</p>
        </div>

        {/* Total Resumes */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Resumes Built</h3>
          <p className="text-3xl font-playfair font-medium text-[#1a1a1a]">{metrics.totalResumes}</p>
        </div>

        {/* Total AI Requests */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total AI Generations</h3>
          <p className="text-3xl font-playfair font-medium text-[#1a1a1a]">{metrics.totalAiLogs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-playfair font-medium text-[#1a1a1a] mb-6">User Growth (7 Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="users" stroke="#1a1a1a" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-playfair font-medium text-[#1a1a1a] mb-6">AI Token Consumption</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f4f4f5'}}
                />
                <Bar dataKey="tokens" fill="#1a1a1a" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
