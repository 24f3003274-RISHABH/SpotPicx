import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, ShieldCheck, Zap, Building2, Crown, ArrowRight, Loader2 } from 'lucide-react';
import { BusinessPlan, monetizationService } from '../../services/monetizationService';

interface PricingPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  currentPlan?: string;
  onPlanUpgraded?: () => void;
}

export const PricingPlansModal: React.FC<PricingPlansModalProps> = ({
  isOpen,
  onClose,
  businessId,
  currentPlan = 'FREE',
  onPlanUpgraded,
}) => {
  const [plans, setPlans] = useState<Record<string, BusinessPlan> | null>(null);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');
  const [loading, setLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      monetizationService
        .getPlans()
        .then((res) => {
          setPlans(res.plans);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPlan = async (planId: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE') => {
    setUpgradingPlan(planId);
    setSuccessMessage(null);

    try {
      if (planId === 'FREE') {
        const res = await monetizationService.initiateCheckout({
          businessId,
          planId: 'FREE',
          billingCycle: 'MONTHLY',
        });
        setSuccessMessage('Switched to Free Starter plan.');
        setTimeout(() => {
          onPlanUpgraded?.();
          onClose();
        }, 1200);
        return;
      }

      // Initiate checkout session (Simulation / Razorpay / Stripe unified flow)
      const checkoutRes = await monetizationService.initiateCheckout({
        businessId,
        planId,
        billingCycle,
        provider: 'MOCK',
      });

      // Verify and activate
      await monetizationService.verifyPayment({
        businessId,
        planId,
        billingCycle,
        provider: 'MOCK',
        paymentId: `pay_${Date.now()}`,
        sessionId: checkoutRes.session?.sessionId,
      });

      setSuccessMessage(`Successfully upgraded to ${plans?.[planId]?.name || planId} Plan!`);
      setTimeout(() => {
        onPlanUpgraded?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Upgrade failed. Please try again.');
    } finally {
      setUpgradingPlan(null);
    }
  };

  const getPlanIcon = (id: string) => {
    switch (id) {
      case 'BASIC':
        return <Zap className="h-5 w-5 text-blue-600" />;
      case 'PREMIUM':
        return <Crown className="h-5 w-5 text-amber-500" />;
      case 'ENTERPRISE':
        return <Building2 className="h-5 w-5 text-indigo-600" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-neutral-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl rounded-3xl bg-white p-6 md:p-10 shadow-2xl my-8">
        {/* Close Button */}
        <button
          id="btn-close-pricing-modal"
          onClick={onClose}
          className="absolute top-6 right-6 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            SpotPicks Merchant Growth Engine
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900">
            Choose the Perfect Plan for Your Business
          </h2>
          <p className="text-sm text-neutral-600">
            Reach high-intent local foodies, shoppers, and students across Delhi NCR. Upgrade or cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center rounded-xl bg-neutral-100 p-1 border border-neutral-200">
              <button
                id="btn-toggle-monthly"
                type="button"
                onClick={() => setBillingCycle('MONTHLY')}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                id="btn-toggle-annual"
                type="button"
                onClick={() => setBillingCycle('ANNUAL')}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                  billingCycle === 'ANNUAL'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="rounded bg-amber-400/30 text-[10px] font-extrabold px-1.5 py-0.2 text-amber-300">
                  SAVE UP TO 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mt-6 mx-auto max-w-md rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center text-sm font-semibold text-emerald-800 animate-in zoom-in-95">
            {successMessage}
          </div>
        )}

        {/* Pricing Cards Grid */}
        {loading || !plans ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'] as const).map((planKey) => {
              const plan = plans[planKey];
              if (!plan) return null;
              const isCurrent = currentPlan.toUpperCase() === planKey;
              const pricing = billingCycle === 'ANNUAL' ? plan.pricing.annual : plan.pricing.monthly;

              return (
                <div
                  key={plan.id}
                  id={`plan-card-${plan.id.toLowerCase()}`}
                  className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all ${
                    plan.popular
                      ? 'border-2 border-amber-500 bg-gradient-to-b from-amber-50/50 via-white to-white shadow-lg'
                      : 'border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md'
                  }`}
                >
                  {/* Badge */}
                  {plan.badgeText && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-neutral-900 px-3 py-0.5 text-[10px] font-extrabold tracking-wider text-amber-400 shadow-sm">
                        {plan.badgeText}
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-neutral-100">{getPlanIcon(plan.id)}</div>
                        <h3 className="font-bold text-neutral-900">{plan.name}</h3>
                      </div>
                      {isCurrent && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                          Active Plan
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 min-h-[32px] leading-relaxed">
                      {plan.tagline}
                    </p>

                    {/* Price Display */}
                    <div className="mt-4 pb-4 border-b border-neutral-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-neutral-900">
                          {pricing.displayPrice}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium">{pricing.period}</span>
                      </div>
                      {billingCycle === 'ANNUAL' && pricing.savingsPercent ? (
                        <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                          Billed ₹{pricing.amount.toLocaleString('en-IN')}/year
                        </p>
                      ) : (
                        <p className="mt-1 text-[11px] text-neutral-400">Monthly rolling subscription</p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="mt-5 space-y-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        What's Included
                      </p>
                      <ul className="space-y-2 text-xs">
                        {plan.features.map((f, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-2 ${
                              f.included ? 'text-neutral-700' : 'text-neutral-400 line-through opacity-60'
                            }`}
                          >
                            <Check
                              className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                                f.included
                                  ? f.highlight
                                    ? 'text-amber-600 stroke-[2.5]'
                                    : 'text-neutral-900'
                                  : 'text-neutral-300'
                              }`}
                            />
                            <span className={f.highlight ? 'font-semibold text-neutral-900' : ''}>
                              {f.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Action */}
                  <div className="mt-6 pt-4">
                    <button
                      id={`btn-select-plan-${plan.id.toLowerCase()}`}
                      disabled={isCurrent || upgradingPlan !== null}
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all disabled:opacity-50 ${
                        isCurrent
                          ? 'bg-neutral-100 text-neutral-400 cursor-default'
                          : plan.popular
                          ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-sm'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800'
                      }`}
                    >
                      {upgradingPlan === plan.id ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : isCurrent ? (
                        <span>Current Active Tier</span>
                      ) : (
                        <>
                          <span>Select {plan.name}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
