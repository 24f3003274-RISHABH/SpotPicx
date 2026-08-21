import React, { useEffect, useState } from 'react';
import {
  Flag,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export const AdminReportsTab: React.FC = () => {
  const [reports, setReports] = useState<any[]>([
    {
      _id: 'rep-1',
      type: 'BUSINESS',
      targetId: 'blue-tokai-saidulajab',
      targetName: 'Blue Tokai Coffee Roasters',
      reason: 'Incorrect operating hours on Sunday',
      reportedBy: 'priya_sharma@example.com',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'rep-2',
      type: 'REVIEW',
      targetId: 'rev-456',
      targetName: 'Review at Diggin Chanakyapuri',
      reason: 'Suspected promotional spam',
      reportedBy: 'aravind@example.com',
      status: 'RESOLVED',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleResolve = (id: string) => {
    setReports(reports.map((r) => (r._id === id ? { ...r, status: 'RESOLVED' } : r)));
  };

  const handleDismiss = (id: string) => {
    setReports(reports.filter((r) => r._id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Flag className="h-5 w-5 text-rose-600" />
            <span>Community Flags & Incident Reports</span>
          </h2>
          <p className="text-xs text-slate-500">
            Triage explorer feedback on closed establishments, spam reviews, and outdated information.
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
          <p className="text-xs text-slate-500">All reports resolved and clear!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{rep.targetName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {rep.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Reported by {rep.reportedBy} • {new Date(rep.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    rep.status === 'PENDING'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {rep.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <strong>Reason:</strong> {rep.reason}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                {rep.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => handleResolve(rep._id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    Mark Resolved
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDismiss(rep._id)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
