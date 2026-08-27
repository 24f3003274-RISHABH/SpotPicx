import React, { useState } from 'react';
import { X, Send, Calendar, Clock, Users, Phone, Mail, User, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { monetizationService } from '../../services/monetizationService';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  categoryName?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  categoryName,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await monetizationService.submitEnquiry({
        businessId,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        message: message.trim() || undefined,
        partySize: Number(partySize) || undefined,
        preferredDate: preferredDate || undefined,
        preferredTime: preferredTime || undefined,
        sourceUrl: window.location.pathname,
      });

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          id="btn-close-enquiry"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Enquiry Sent to {businessName}</h3>
            <p className="text-sm text-neutral-600 max-w-sm mx-auto">
              Your inquiry has been sent directly to the establishment's team. They will contact you shortly on{' '}
              <strong className="text-neutral-900">{phone}</strong>.
            </p>
            <div className="pt-4">
              <button
                id="btn-enquiry-done"
                onClick={handleResetAndClose}
                className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                Direct Merchant Connect
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Send Enquiry / Reservation</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Direct booking & custom request for <strong className="text-neutral-700">{businessName}</strong>
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    <input
                      id="input-enquiry-name"
                      type="text"
                      required
                      placeholder="Pooja Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    <input
                      id="input-enquiry-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <input
                    id="input-enquiry-email"
                    type="email"
                    placeholder="pooja@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Reservation Details */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Party Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-2.5 top-3 h-3.5 w-3.5 text-neutral-400" />
                    <select
                      id="select-enquiry-party"
                      value={partySize}
                      onChange={(e) => setPartySize(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 pl-7 pr-2 py-2.5 text-xs focus:border-neutral-900 focus:outline-none"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="4">4 People</option>
                      <option value="6">6 People</option>
                      <option value="10">10+ Group</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-3 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      id="input-enquiry-date"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 pl-7 pr-2 py-2 text-xs focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-3 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      id="input-enquiry-time"
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 pl-7 pr-2 py-2 text-xs focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Message / Special Request
                </label>
                <textarea
                  id="textarea-enquiry-msg"
                  rows={3}
                  placeholder="Need rooftop table with lake view, celebrating anniversary..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 p-3 text-sm focus:border-neutral-900 focus:outline-none resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                id="btn-submit-enquiry"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending to Owner...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Direct Enquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
