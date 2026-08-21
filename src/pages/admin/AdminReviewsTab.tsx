import React, { useEffect, useState } from 'react';
import {
  MessageSquareQuote,
  Star,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  User,
  ExternalLink,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminReviewsTab: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getReviews(filter === 'ALL' ? undefined : filter);
      setReviews(data);
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [filter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setActionId(id);
      await adminService.updateReviewStatus(id, status);
      await loadReviews();
    } catch (e: any) {
      alert(e.message || 'Failed to update review status');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      setActionId(id);
      await adminService.deleteReview(id);
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete review');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-rose-600" />
            <span>Customer Reviews Moderation</span>
          </h2>
          <p className="text-xs text-slate-500">
            Moderate community reviews, flag inappropriate content, and enforce authenticity.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {['ALL', 'APPROVED', 'PENDING', 'FLAGGED'].map((s) => (
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
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <MessageSquareQuote className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No reviews found matching filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isBusy = actionId === rev._id;
            return (
              <div
                key={rev._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">
                        {rev.user?.name || 'Explorer'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating} / 5</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        rev.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : rev.status === 'FLAGGED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {rev.status || 'APPROVED'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">{rev.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>

                {/* Moderation Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rev._id, 'APPROVED')}
                      disabled={isBusy}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(rev._id, 'FLAGGED')}
                      disabled={isBusy}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold"
                    >
                      Flag for Spam
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(rev._id)}
                    disabled={isBusy}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete review"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
