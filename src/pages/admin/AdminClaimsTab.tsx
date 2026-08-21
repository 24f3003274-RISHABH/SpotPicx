import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  User,
  Store,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { claimService, BusinessClaim } from '../../services/claimService';

export const AdminClaimsTab: React.FC = () => {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadClaims = async () => {
    try {
      setIsLoading(true);
      const data = await claimService.getAllClaims();
      setClaims(data);
    } catch (e) {
      console.error('Failed to load claims:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm('Approve this business ownership claim and grant management rights?')) return;
    try {
      setActionInProgress(id);
      await claimService.approveClaim(id);
      await loadClaims();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to approve claim');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Enter rejection reason (optional):', 'Insufficient verification proof or mismatching GST documentation');
    if (reason === null) return;
    try {
      setActionInProgress(id);
      await claimService.rejectClaim(id, reason);
      await loadClaims();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to reject claim');
    } finally {
      setActionInProgress(null);
    }
  };

  const filtered = claims.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-rose-600" />
            <span>Business Ownership Claims ({claims.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Verify proprietor documentation and approve management access for Delhi spots.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === s
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Claims List */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading ownership claims...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <ShieldCheck className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No claims found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no ownership claims matching this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((claim) => {
            const isPending = claim.status === 'PENDING';
            const isBusy = actionInProgress === claim._id;

            return (
              <div
                key={claim._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-extrabold text-slate-900">
                        {claim.business?.name || 'Spot Listing'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          claim.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : claim.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {claim.business?.locality}, Delhi • Submitted on{' '}
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Claimant info */}
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span className="font-semibold text-slate-700">{claim.user?.name || 'User'}</span>
                    <span className="text-slate-400 font-mono">({claim.user?.email})</span>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Claimant Statement:</span>
                  <p className="text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {claim.message || 'No statement provided.'}
                  </p>
                </div>

                {/* Documents */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Verification Documents & Proof:</span>
                  <div className="flex flex-wrap gap-2">
                    {claim.documents && claim.documents.length > 0 ? (
                      claim.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>{doc}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No attachments</span>
                    )}
                  </div>
                </div>

                {/* Rejection reason if any */}
                {claim.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-700">
                    <strong>Rejection Reason:</strong> {claim.rejectionReason}
                  </div>
                )}

                {/* Actions */}
                {isPending && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(claim._id)}
                      disabled={isBusy}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject Claim</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(claim._id)}
                      disabled={isBusy}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      {isBusy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve & Grant Ownership</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
