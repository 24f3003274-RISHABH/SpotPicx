import React, { useState } from 'react';
import {
  Star,
  ThumbsUp,
  Flag,
  Share2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit2,
  CornerDownRight,
  Send,
  Loader2,
  X,
} from 'lucide-react';
import { Review } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { reviewApi } from '../../api/reviewApi';
import { useAuth } from '../../hooks/useAuth';
import { ReportModal } from '../common/ReportModal';
import { ShareButton } from '../common/ShareButton';

interface ReviewCardProps {
  review: Review;
  onReviewUpdated?: (updated: Review) => void;
  onReviewDeleted?: (reviewId: string) => void;
  onEditClick?: (review: Review) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onReviewUpdated,
  onReviewDeleted,
  onEditClick,
}) => {
  const { user, hasRole } = useAuth();
  const [likesCount, setLikesCount] = useState(review.likeCount || 0);
  const [isLiked, setIsLiked] = useState(
    user && review.likes ? review.likes.includes(user.id || (user as any)._id) : false
  );
  const [isLiking, setIsLiking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Business response state
  const [isResponding, setIsResponding] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(review.response);

  const isAuthor =
    user && (user.id === review.user?._id || (user as any)._id === review.user?._id);
  const canModerate = hasRole(['ADMIN', 'SUPER_ADMIN', 'BUSINESS_OWNER']);

  const handleLike = async () => {
    if (!user) {
      alert('Please sign in to like reviews.');
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    // Optimistic UI
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await reviewApi.toggleLike(review._id);
      setLikesCount(res.data.likeCount);
      setIsLiked(res.data.isLiked);
    } catch (err) {
      // Revert on error
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewApi.deleteReview(review._id);
      onReviewDeleted?.(review._id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const handlePostResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setIsSubmittingResponse(true);
    try {
      const res = await reviewApi.respondToReview(review._id, {
        comment: responseText.trim(),
        respondedBy: user?.name || 'Spot Management',
      });
      setCurrentResponse(res.data.response);
      setIsResponding(false);
      setResponseText('');
      onReviewUpdated?.(res.data);
    } catch (err: any) {
      alert(err.message || 'Failed to submit response');
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  return (
    <>
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
        {/* Header: User & Rating */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
              {review.user?.avatar ? (
                <img
                  src={review.user.avatar}
                  alt={review.user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{review.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {review.user?.name || 'Verified Explorer'}
                </span>
                {review.user?.role === 'SUPER_ADMIN' || review.user?.role === 'ADMIN' ? (
                  <Badge variant="indigo" size="sm" className="text-[10px] py-0">
                    Staff
                  </Badge>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <CheckCircle2 className="h-3 w-3" /> Verified Visit
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span>•</span>
                <span>
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Author/Admin Actions Menu */}
          <div className="flex items-center gap-1">
            {isAuthor && onEditClick && (
              <button
                onClick={() => onEditClick(review)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit review"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}
            {(isAuthor || canModerate) && (
              <button
                onClick={handleDelete}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete review"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => setShowReportModal(true)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Report this review"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Comment */}
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-slate-900 leading-snug">{review.title}</h4>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {review.comment}
          </p>
        </div>

        {/* Attached Photos */}
        {review.images && review.images.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {review.images.map((imgUrl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActivePhoto(imgUrl)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 hover:opacity-90 hover:scale-102 transition-all group"
              >
                <img
                  src={imgUrl}
                  alt={`Review photo ${i + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}

        {/* Visit Date */}
        {review.visitDate && (
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>
              Date of experience:{' '}
              {new Date(review.visitDate).toLocaleDateString('en-IN', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        )}

        {/* Footer: Likes, Share & Respond */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isLiked
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-indigo-600' : ''}`} />
              <span>Helpful</span>
              {likesCount > 0 && <span className="font-mono text-[11px]">({likesCount})</span>}
            </button>

            <ShareButton
              title={`${review.title} — Review on SpotPicks`}
              text={`Read this review: "${review.comment.substring(0, 100)}..."`}
              variant="ghost"
              size="sm"
              label="Share"
            />
          </div>

          {/* Respond toggle for Owner / Admin */}
          {canModerate && !currentResponse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsResponding(!isResponding)}
              leftIcon={<MessageSquare className="h-3.5 w-3.5 text-indigo-600" />}
            >
              {isResponding ? 'Cancel' : 'Respond as Business'}
            </Button>
          )}
        </div>

        {/* Inline Response Form for Owner */}
        {isResponding && (
          <form onSubmit={handlePostResponse} className="mt-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <CornerDownRight className="h-3.5 w-3.5" />
              <span>Official Business Response</span>
            </div>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Thank the customer or address feedback professionally..."
              rows={2}
              className="w-full text-xs p-2.5 bg-white rounded-lg border border-indigo-200 focus:outline-hidden focus:border-indigo-600 text-slate-900 resize-none"
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsResponding(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmittingResponse}
                leftIcon={isSubmittingResponse ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              >
                Post Response
              </Button>
            </div>
          </form>
        )}

        {/* Existing Business Response Block */}
        {currentResponse && (
          <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 relative">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Response from {currentResponse.respondedBy || 'Owner'}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {new Date(currentResponse.respondedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{currentResponse.comment}"
            </p>
          </div>
        )}
      </div>

      {/* Lightbox for review image */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-2xl w-full bg-transparent p-2">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={activePhoto}
              alt="Expanded review photo"
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="REVIEW"
        targetId={review._id}
        targetName={`Review by ${review.user?.name}`}
      />
    </>
  );
};
