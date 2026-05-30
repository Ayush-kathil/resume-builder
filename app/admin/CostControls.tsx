"use client";

import { useState, useEffect } from "react";
import { Activity, AlertTriangle, DollarSign, Cpu } from "lucide-react";

type Metrics = {
  totalTokens: number;
  totalCost: number;
  flags: number;
  totalRequests: number;
};

type Log = {
  _id: string;
  endpoint: string;
  totalTokens: number;
  costEstimateUSD: number;
  jailbreakFlagged: boolean;
  piiRedacted: boolean;
  createdAt: string;
};

export default function CostControls() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/admin/metrics");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setLogs(data.recentLogs);
        }
      } catch (e) {
        console.error("Failed to fetch metrics", e);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2 text-[#a1a1aa]">
            <Cpu className="h-5 w-5 text-blue-400" />
            <h2 className="text-sm font-medium">Total Tokens</h2>
          </div>
          <p className="text-3xl font-bold text-white">{metrics?.totalTokens.toLocaleString() || 0}</p>
        </div>
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2 text-[#a1a1aa]">
            <DollarSign className="h-5 w-5 text-green-400" />
            <h2 className="text-sm font-medium">Estimated Cost</h2>
          </div>
          <p className="text-3xl font-bold text-white">${(metrics?.totalCost || 0).toFixed(4)}</p>
        </div>
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2 text-[#a1a1aa]">
            <Activity className="h-5 w-5 text-purple-400" />
            <h2 className="text-sm font-medium">Total Requests</h2>
          </div>
          <p className="text-3xl font-bold text-white">{metrics?.totalRequests || 0}</p>
        </div>
        <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-2 text-[#a1a1aa]">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h2 className="text-sm font-medium">Security Flags</h2>
          </div>
          <p className="text-3xl font-bold text-white">{metrics?.flags || 0}</p>
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-[#27272a] flex justify-between items-center bg-[#18181b]">
          <h3 className="font-semibold text-white">Recent AI Activity Logs</h3>
        </div>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#18181b] z-10">
              <tr className="border-b border-[#27272a]">
                <th className="py-3 px-6 font-medium text-xs text-[#71717a] uppercase tracking-wider">Time</th>
                <th className="py-3 px-6 font-medium text-xs text-[#71717a] uppercase tracking-wider">Endpoint</th>
                <th className="py-3 px-6 font-medium text-xs text-[#71717a] uppercase tracking-wider">Tokens</th>
                <th className="py-3 px-6 font-medium text-xs text-[#71717a] uppercase tracking-wider">Cost</th>
                <th className="py-3 px-6 font-medium text-xs text-[#71717a] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#71717a]">No activity logged yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#27272a]/30 transition-colors">
                    <td className="py-3 px-6 text-[#71717a] text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-[#ededed] font-medium text-sm">
                      {log.endpoint}
                    </td>
                    <td className="py-3 px-6 text-[#71717a] font-mono text-sm">
                      {log.totalTokens}
                    </td>
                    <td className="py-3 px-6 text-[#71717a] font-mono text-sm">
                      ${log.costEstimateUSD.toFixed(6)}
                    </td>
                    <td className="py-3 px-6">
                      {log.jailbreakFlagged ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Flagged
                        </span>
                      ) : log.piiRedacted ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          Redacted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Clean
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
