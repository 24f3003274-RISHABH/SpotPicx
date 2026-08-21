import React, { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { reportApi } from '../../api/reportApi';
import { ReportReason, ReportTargetType } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetName?: string;
}

const REASON_OPTIONS: Array<{ value: ReportReason; label: string; description: string }> = [
  {
    value: 'SPAM_OR_FAKE',
    label: 'Spam or Fake Information',
    description: 'Promotional spam, fake reviews, or bot activity',
  },
  {
    value: 'INAPPROPRIATE_CONTENT',
    label: 'Inappropriate or Offensive Content',
    description: 'Explicit language, hate speech, or nudity',
  },
  {
    value: 'OUTDATED_OR_CLOSED',
    label: 'Permanently Closed or Relocated',
    description: 'This spot has shut down or moved to another location',
  },
  {
    value: 'INCORRECT_LOCATION',
    label: 'Incorrect Location / Map Marker',
    description: 'The GPS coordinates or address are misleading',
  },
  {
    value: 'HARASSMENT',
    label: 'Harassment or Defamation',
    description: 'Personal attacks against business staff or customers',
  },
  {
    value: 'COPYRIGHT',
    label: 'Copyright or IP Infringement',
    description: 'Unauthorized usage of photos, logos, or trademarks',
  },
  {
    value: 'OTHER',
    label: 'Other Issues',
    description: 'Any other violation of SpotPicks community guidelines',
  },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState<ReportReason>('SPAM_OR_FAKE');
  const [details, setDetails] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || details.trim().length < 5) {
      setErrorMessage('Please provide a brief explanation (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await reportApi.createReport({
        targetType,
        targetId,
        targetName,
        reason,
        details: details.trim(),
        reporterEmail: user?.email || reporterEmail.trim(),
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setDetails('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-rose-600">
            <Flag className="h-4 w-4" />
            <h2 className="text-sm font-bold text-slate-900">
              Report {targetType.toLowerCase().replace('_', ' ')}
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Report Submitted</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Thank you for helping keep the SpotPicks community authentic. Our Delhi moderation team will investigate this report within 24 hours.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={handleResetAndClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {targetName && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Target:</span> {targetName}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Reason Radio Group */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                What is the issue?
              </label>
              <div className="space-y-2">
                {REASON_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      reason === opt.value
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={opt.value}
                      checked={reason === opt.value}
                      onChange={() => setReason(opt.value)}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="space-y-0.5">
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 font-normal leading-tight">
                        {opt.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Additional Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain the reason for reporting with any specific context..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all resize-none text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            {/* Email if not logged in */}
            {!user && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Your Email (Optional for updates)
                </label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={handleResetAndClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                disabled={isSubmitting}
                leftIcon={isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : undefined}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
