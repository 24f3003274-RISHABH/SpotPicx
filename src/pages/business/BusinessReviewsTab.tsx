import React, { useEffect, useState } from 'react';
import {
  MessageSquareQuote,
  Star,
  CornerDownRight,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  User,
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { useAuth } from '../../hooks/useAuth';

export const BusinessReviewsTab: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [isSubmittingMap, setIsSubmittingMap] = useState<Record<string, boolean>>({});
  const [feedbackMsg, setFeedbackMsg] = useState<{ id: string; text: string } | null>(null);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/business-owner/reviews');
      setReviews(res.data.data.reviews || res.data.data || []);
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSendReply = async (reviewId: string) => {
    const replyText = replyTextMap[reviewId];
    if (!replyText || replyText.trim().length < 2) return;

    try {
      setIsSubmittingMap({ ...isSubmittingMap, [reviewId]: true });
      await apiClient.post(`/business-owner/reviews/${reviewId}/reply`, {
        comment: replyText.trim(),
        respondedBy: `${user?.name || 'Owner'} (Management)`,
      });

      setFeedbackMsg({ id: reviewId, text: 'Reply posted with Official Owner badge!' });
      setReplyTextMap({ ...replyTextMap, [reviewId]: '' });
      await loadReviews();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to post reply');
    } finally {
      setIsSubmittingMap({ ...isSubmittingMap, [reviewId]: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-indigo-600" />
            <span>Customer Reviews & Feedback</span>
          </h2>
          <p className="text-xs text-slate-500">
            Read reviews from Delhi explorers and respond with your official business badge.
          </p>
        </div>
        <div className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          {reviews.length} total reviews
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <MessageSquareQuote className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No reviews yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Reviews posted by customers visiting your establishment will appear here for responses.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const hasResponse = Boolean(rev.response && rev.response.comment);
            const isReplying = isSubmittingMap[rev._id];

            return (
              <div
                key={rev._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-bold shrink-0">
                      {rev.user?.avatar ? (
                        <img src={rev.user.avatar} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{rev.user?.name || 'Verified Explorer'}</span>
                        <span className="text-slate-400 font-normal">@{rev.user?.username || 'delhi_user'}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl font-extrabold text-xs text-amber-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating} / 5</span>
                    </div>
                    {rev.businessName && (
                      <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                        at <strong>{rev.businessName}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Body */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold text-slate-900">{rev.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-2 pt-2">
                      {rev.images.map((img: string, i: number) => (
                        <img
                          key={i}
                          src={img}
                          alt="Review attachment"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Official Response Banner */}
                {hasResponse ? (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                      <span className="flex items-center gap-1.5">
                        <CornerDownRight className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Official Response from {rev.response.respondedBy || 'Management'}</span>
                      </span>
                      <span className="text-[11px] text-indigo-500 font-normal">
                        {rev.response.respondedAt
                          ? new Date(rev.response.respondedAt).toLocaleDateString()
                          : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-950/80 leading-relaxed pl-5">
                      {rev.response.comment}
                    </p>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {feedbackMsg?.id === rev._id && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{feedbackMsg.text}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyTextMap[rev._id] || ''}
                        onChange={(e) =>
                          setReplyTextMap({ ...replyTextMap, [rev._id]: e.target.value })
                        }
                        placeholder="Write an official response to this customer..."
                        className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(rev._id)}
                        disabled={isReplying || !(replyTextMap[rev._id] || '').trim()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        {isReplying ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>Respond</span>
                          </>
                        )}
                      </button>
                    </div>
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
