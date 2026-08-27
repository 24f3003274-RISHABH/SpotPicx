import React, { useState, useEffect } from 'react';
import {
  Crown,
  Zap,
  Building2,
  ShieldCheck,
  Calendar,
  CreditCard,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Download,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { BusinessSubscription, monetizationService } from '../../services/monetizationService';
import { PricingPlansModal } from '../../components/monetization/PricingPlansModal';

interface BusinessSubscriptionTabProps {
  businessId: string;
}

export const BusinessSubscriptionTab: React.FC<BusinessSubscriptionTabProps> = ({ businessId }) => {
  const [subscription, setSubscription] = useState<BusinessSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadSubscription = () => {
    setLoading(true);
    monetizationService
      .getSubscription(businessId || 'spot-1')
      .then((data) => setSubscription(data))
      .catch((err) => console.warn('Failed to load subscription', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubscription();
  }, [businessId]);

  const handleCancelAutoRenew = async () => {
    if (!window.confirm('Are you sure you want to disable subscription auto-renewal?')) return;
    setIsCancelling(true);
    try {
      await monetizationService.cancelSubscription(businessId);
      loadSubscription();
    } catch (err) {
      alert('Failed to cancel auto-renewal');
    } finally {
      setIsCancelling(false);
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'PREMIUM':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-800">
            <Crown className="h-3.5 w-3.5 text-amber-600" /> Featured Premium
          </span>
        );
      case 'ENTERPRISE':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-800">
            <Building2 className="h-3.5 w-3.5 text-indigo-600" /> Brand Enterprise
          </span>
        );
      case 'BASIC':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-800">
            <Zap className="h-3.5 w-3.5 text-blue-600" /> Growth Basic
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-neutral-200 px-2.5 py-1 text-xs font-bold text-neutral-800">
            <ShieldCheck className="h-3.5 w-3.5 text-neutral-600" /> Free Starter
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Plan Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              {getPlanBadge(subscription?.plan || 'FREE')}
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                {subscription?.billingStatus || 'ACTIVE'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900">
              {subscription?.planDetails?.name || 'Current Plan'}
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {subscription?.planDetails?.tagline || 'Essential local business discovery and presence on SpotPicks.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                Renews on:{' '}
                <strong className="text-neutral-800">
                  {subscription?.nextBillingDate
                    ? new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </strong>
              </span>
              <span className="inline-flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-neutral-400" />
                Cycle: <strong className="text-neutral-800">{subscription?.billingCycle || 'MONTHLY'}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              id="btn-upgrade-subscription"
              onClick={() => setIsPricingModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-600 hover:shadow-md"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Upgrade / Change Plan</span>
            </button>

            {subscription?.plan !== 'FREE' && subscription?.autoRenew && (
              <button
                id="btn-cancel-autorenew"
                disabled={isCancelling}
                onClick={handleCancelAutoRenew}
                className="text-center py-2 text-xs font-medium text-neutral-500 hover:text-rose-600 transition-colors"
              >
                Disable Auto-Renew
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Entitlements Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-neutral-900">Active Feature Entitlements</h3>
          <ul className="space-y-3 text-xs text-neutral-700">
            <li className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-medium">Promotional Offers Limit</span>
              <span className="font-bold text-neutral-900">
                {subscription?.planDetails?.limits?.activeOffers || 1} Deals Active
              </span>
            </li>
            <li className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-medium">Gallery Photos Allowed</span>
              <span className="font-bold text-neutral-900">
                Up to {subscription?.planDetails?.limits?.photosUpload || 5} Photos
              </span>
            </li>
            <li className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-medium">Verified Merchant Blue Tick</span>
              <span
                className={`font-bold ${
                  subscription?.planDetails?.limits?.verifiedBadge ? 'text-emerald-700' : 'text-neutral-400'
                }`}
              >
                {subscription?.planDetails?.limits?.verifiedBadge ? 'Enabled' : 'Disabled'}
              </span>
            </li>
            <li className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-medium">Direct WhatsApp Customer Lead</span>
              <span
                className={`font-bold ${
                  subscription?.planDetails?.limits?.whatsappDirectLead ? 'text-emerald-700' : 'text-neutral-400'
                }`}
              >
                {subscription?.planDetails?.limits?.whatsappDirectLead ? 'Enabled' : 'Disabled'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-medium">AI Concierge Citation Boost</span>
              <span
                className={`font-bold ${
                  subscription?.planDetails?.limits?.aiConciergeCitations ? 'text-emerald-700' : 'text-neutral-400'
                }`}
              >
                {subscription?.planDetails?.limits?.aiConciergeCitations ? 'Active' : 'Not Included'}
              </span>
            </li>
          </ul>
        </div>

        {/* Invoices & Receipts */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-neutral-900">Invoices & Billing History</h3>
          <div className="space-y-3">
            {(subscription?.invoiceHistory || [
              {
                invoiceId: 'INV-2026-0801',
                amount: subscription?.amount || 2499,
                currency: 'INR',
                date: new Date().toISOString(),
                status: 'PAID',
              },
            ]).map((inv, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 text-xs"
              >
                <div>
                  <p className="font-bold text-neutral-900">{inv.invoiceId}</p>
                  <p className="text-[11px] text-neutral-500">
                    {new Date(inv.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-neutral-900">
                    ₹{inv.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {inv.status}
                  </span>
                  <button
                    onClick={() => alert(`Downloading invoice ${inv.invoiceId} PDF...`)}
                    className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingPlansModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        businessId={businessId}
        currentPlan={subscription?.plan || 'FREE'}
        onPlanUpgraded={loadSubscription}
      />
    </div>
  );
};
