import React, { useState, useEffect } from 'react';
import { X, Star, Upload, Sparkles, Image, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { RatingInput } from './RatingInput';
import { Button } from '../ui/Button';
import { reviewApi } from '../../api/reviewApi';
import { Review } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ReviewFormProps {
  businessId: string;
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (review: Review) => void;
  existingReview?: Review | null;
}

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
];

export const ReviewForm: React.FC<ReviewFormProps> = ({
  businessId,
  businessName,
  isOpen,
  onClose,
  onSuccess,
  existingReview,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [visitDate, setVisitDate] = useState(
    existingReview?.visitDate ? existingReview.visitDate.substring(0, 10) : new Date().toISOString().substring(0, 10)
  );
  const [images, setImages] = useState<string[]>(existingReview?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setTitle(existingReview.title);
      setComment(existingReview.comment);
      setVisitDate(
        existingReview.visitDate ? existingReview.visitDate.substring(0, 10) : new Date().toISOString().substring(0, 10)
      );
      setImages(existingReview.images || []);
    } else {
      setRating(5);
      setTitle('');
      setComment('');
      setImages([]);
    }
  }, [existingReview, isOpen]);

  if (!isOpen) return null;

  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    if (images.length >= 6) {
      alert('Maximum 6 photos allowed per review.');
      return;
    }
    setImages([...images, url.trim()]);
    setNewImageUrl('');
    setShowImageInput(false);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }
    if (!title.trim() || title.trim().length < 2) {
      setError('Please provide a short review headline (at least 2 characters).');
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setError('Please write at least 10 characters detailing your experience.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (existingReview?._id) {
        const res = await reviewApi.updateReview(existingReview._id, {
          rating,
          title: title.trim(),
          comment: comment.trim(),
          visitDate,
          images,
        });
        onSuccess(res.data);
      } else {
        const res = await reviewApi.createReview({
          businessId,
          rating,
          title: title.trim(),
          comment: comment.trim(),
          visitDate,
          images,
        });
        onSuccess(res.data);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              {existingReview ? 'Update Your Feedback' : 'Write a Review'}
            </span>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              {businessName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Star Rating Input */}
          <div className="space-y-1.5 p-4 bg-amber-50/40 rounded-2xl border border-amber-100/60">
            <label className="block text-xs font-bold text-slate-800">
              Overall Rating <span className="text-rose-500">*</span>
            </label>
            <RatingInput value={rating} onChange={setRating} size="lg" />
          </div>

          {/* Review Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Review Title / Headline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Best cold coffee & sunset view in South Delhi!"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900 font-medium placeholder:text-slate-400"
              required
            />
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Your Detailed Experience <span className="text-rose-500">*</span></span>
              <span className="text-[11px] text-slate-400 font-normal">
                {comment.length}/2000 chars (min 10)
              </span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you order? How was the service, ambiance, hygiene, and pricing?"
              rows={4}
              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900 resize-none placeholder:text-slate-400"
              required
            />
          </div>

          {/* Visit Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              When did you visit?
            </label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-700"
            />
          </div>

          {/* Photo Attachments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Add Experience Photos ({images.length}/6)
              </label>
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Image URL
              </button>
            </div>

            {/* Uploaded Thumbnails */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute inset-0 bg-slate-950/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-rose-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Image URL input */}
            {showImageInput && (
              <div className="flex gap-2 pt-1">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste direct image URL (https://...)"
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-indigo-600 text-slate-900"
                />
                <Button type="button" size="sm" variant="primary" onClick={() => handleAddImage(newImageUrl)}>
                  Add
                </Button>
              </div>
            )}

            {/* Quick sample photo presets for instant preview */}
            {images.length === 0 && (
              <div className="pt-1">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" /> Quick Add Photo Samples:
                </div>
                <div className="flex gap-2">
                  {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddImage(preset)}
                      className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 hover:border-indigo-500 transition-all opacity-80 hover:opacity-100"
                      title="Add sample photo"
                    >
                      <img src={preset} alt="Sample" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              leftIcon={isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : undefined}
            >
              {isSubmitting ? 'Publishing...' : existingReview ? 'Update Review' : 'Publish Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
