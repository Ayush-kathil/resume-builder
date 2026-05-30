"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, XCircle, Search, ShieldAlert } from "lucide-react";

type ReviewLog = {
  _id: string;
  endpoint: string;
  totalTokens: number;
  confidenceScore: number;
  jailbreakFlagged: boolean;
  createdAt: string;
  userId?: { email: string };
};

export default function HumanReview() {
  const [reviews, setReviews] = useState<ReviewLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setResolving(id);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: id, action }),
      });
      if (res.ok) {
        setReviews(reviews.filter((r) => r._id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResolving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <ShieldAlert className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Human-in-the-Loop Review</h2>
            <p className="text-sm text-[#a1a1aa] mt-1">
              {reviews.length} generations require manual approval due to low confidence scores or flagged content.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 text-[#a1a1aa]">Loading review queue...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl py-16 text-center shadow-lg">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">Queue is empty</h3>
            <p className="text-[#a1a1aa] text-sm">All flagged generations have been resolved.</p>
          </div>
        ) : (
          reviews.map((log) => (
            <div key={log._id} className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 shadow-lg flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{log.userId?.email || 'Unknown User'}</span>
                    <span className="text-xs text-[#71717a]">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  {log.jailbreakFlagged ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                      Policy Violation
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      Low Confidence ({log.confidenceScore}/100)
                    </span>
                  )}
                </div>
                
                <div className="bg-[#09090b] rounded-lg p-4 border border-[#27272a] font-mono text-xs text-[#a1a1aa]">
                  <p><strong>Endpoint:</strong> {log.endpoint}</p>
                  <p><strong>Tokens Consumed:</strong> {log.totalTokens}</p>
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-3 md:w-32">
                <button
                  onClick={() => handleAction(log._id, 'approve')}
                  disabled={resolving === log._id}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-green-600/10 text-green-400 hover:bg-green-600/20 border border-green-600/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => handleAction(log._id, 'reject')}
                  disabled={resolving === log._id}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-600/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
