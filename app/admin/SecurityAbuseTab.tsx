import { useState, useEffect } from "react";
import { ShieldCheck, Activity, Key, EyeOff, Server, AlertTriangle } from "lucide-react";

export default function SecurityAbuseTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/admin/audit");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="h-6 w-6 text-gray-800" />
        <h2 className="text-2xl font-playfair font-semibold text-[#1a1a1a]">Security Command Center</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1">Identity & Access</h3>
            <p className="text-xs text-gray-500 mb-3">Enforce MFA and IP Allowlisting for all admin sessions.</p>
            <button className="text-indigo-600 text-xs font-medium hover:underline">Configure Access Policies</button>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
            <EyeOff className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1">Data Privacy & PII</h3>
            <p className="text-xs text-gray-500 mb-3">Mask user data and opt-out of 3rd-party AI model training.</p>
            <button className="text-rose-600 text-xs font-medium hover:underline">Manage Privacy Rules</button>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1">Threat Detection</h3>
            <p className="text-xs text-gray-500 mb-3">Real-time alerts for anomalous AI API token usage and DDoS attempts.</p>
            <button className="text-amber-600 text-xs font-medium hover:underline">View Active Threats</button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#e5e5e5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-[#1a1a1a]">Tamper-Proof Audit Logs</h3>
          </div>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Live Feed
          </span>
        </div>
        
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading audit trail...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <ShieldCheck className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">No audit logs found.</p>
              <p className="text-xs text-gray-400 mt-1">Actions performed by admins will appear here securely.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-[#e5e5e5] text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-6 font-medium">Timestamp</th>
                  <th className="py-3 px-6 font-medium">Action</th>
                  <th className="py-3 px-6 font-medium">Admin</th>
                  <th className="py-3 px-6 font-medium">Target</th>
                  <th className="py-3 px-6 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="py-3 px-6 text-gray-500 font-mono text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${
                        log.action.includes('DELETE') ? 'bg-red-50 text-red-700 border-red-200' :
                        log.action.includes('BAN') ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-[#1a1a1a] font-medium">{log.adminEmail}</td>
                    <td className="py-3 px-6 text-gray-600 truncate max-w-[200px]" title={log.details}>
                      {log.target ? <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded mr-2">{log.target}</span> : null}
                      {log.details}
                    </td>
                    <td className="py-3 px-6 text-gray-500 font-mono text-xs">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
