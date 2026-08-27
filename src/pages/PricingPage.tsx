import React, { useState, useEffect } from 'react';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Crown,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  PhoneCall,
  Flame,
  BadgeCheck,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { BusinessPlan, PromotionPackage, monetizationService } from '../services/monetizationService';
import { PricingPlansModal } from '../components/monetization/PricingPlansModal';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const PricingPage: React.FC = () => {
  const [plans, setPlans] = useState<Record<string, BusinessPlan> | null>(null);
  const [promotionPackages, setPromotionPackages] = useState<PromotionPackage[]>([]);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');
  const [loading, setLoading] = useState(true);
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);

  useEffect(() => {
    monetizationService
      .getPlans()
      .then((data) => {
        setPlans(data.plans);
        setPromotionPackages(data.promotionPackages || []);
      })
      .catch((err) => console.warn('Failed to load plans', err))
      .finally(() => setLoading(false));
  }, []);

  const getPlanIcon = (id: string) => {
    switch (id) {
      case 'BASIC':
        return <Zap className="h-6 w-6 text-blue-600" />;
      case 'PREMIUM':
        return <Crown className="h-6 w-6 text-amber-500" />;
      case 'ENTERPRISE':
        return <Building2 className="h-6 w-6 text-indigo-600" />;
      default:
        return <ShieldCheck className="h-6 w-6 text-neutral-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 md:py-16">
      <Container size="xl">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1 text-xs font-bold text-amber-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            SPOTPICKS MERCHANT PLANS & MONETIZATION
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
            Reach Verified Local Explorers Across Delhi NCR
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            From iconic Chandni Chowk street food gems to luxury Hauz Khas boutiques — choose transparent, value-driven merchant plans that generate real calls, directions, and direct bookings.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-6 flex items-center justify-center">
            <div className="inline-flex items-center rounded-2xl bg-white p-1.5 border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('MONTHLY')}
                className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('ANNUAL')}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                  billingCycle === 'ANNUAL'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="rounded bg-amber-400/30 text-[10px] font-extrabold px-2 py-0.5 text-amber-300">
                  SAVE UP TO 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans &&
            (['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'] as const).map((planKey) => {
              const plan = plans[planKey];
              if (!plan) return null;
              const pricing = billingCycle === 'ANNUAL' ? plan.pricing.annual : plan.pricing.monthly;

              return (
                <div
                  key={plan.id}
                  id={`public-plan-${plan.id.toLowerCase()}`}
                  className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all bg-white ${
                    plan.popular
                      ? 'border-2 border-amber-500 shadow-xl shadow-amber-500/10'
                      : 'border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {plan.badgeText && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-neutral-900 px-4 py-1 text-[11px] font-extrabold tracking-wider text-amber-400 shadow-sm uppercase">
                        {plan.badgeText}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                        {getPlanIcon(plan.id)}
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {plan.id}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900">{plan.name}</h3>
                    <p className="text-xs text-neutral-500 mt-1 min-h-[32px] leading-relaxed">
                      {plan.tagline}
                    </p>

                    {/* Price */}
                    <div className="mt-6 pb-6 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-neutral-900">
                          {pricing.displayPrice}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium">{pricing.period}</span>
                      </div>
                      {billingCycle === 'ANNUAL' && pricing.savingsPercent ? (
                        <p className="mt-1 text-xs font-semibold text-emerald-600">
                          Billed ₹{pricing.amount.toLocaleString('en-IN')}/year
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-neutral-400">Monthly billing, cancel anytime</p>
                      )}
                    </div>

                    {/* Feature Checklist */}
                    <div className="mt-6 space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Plan Entitlements
                      </p>
                      <ul className="space-y-2.5 text-xs">
                        {plan.features.map((f, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-2.5 ${
                              f.included ? 'text-neutral-800' : 'text-slate-400 line-through opacity-50'
                            }`}
                          >
                            <Check
                              className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                                f.included
                                  ? f.highlight
                                    ? 'text-amber-600 stroke-[2.5]'
                                    : 'text-neutral-900'
                                  : 'text-slate-300'
                              }`}
                            />
                            <span className={f.highlight ? 'font-bold text-neutral-900' : ''}>
                              {f.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 pt-4">
                    <Link
                      to={ROUTES.BUSINESS_DASHBOARD}
                      className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-bold transition-all ${
                        plan.popular
                          ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs'
                      }`}
                    >
                      <span>Get Started with {plan.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Promotion Packages Section */}
        {promotionPackages.length > 0 && (
          <div className="mt-16 rounded-3xl bg-white border border-slate-200 p-8 md:p-12 shadow-sm">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
                <Flame className="h-3.5 w-3.5 text-indigo-600" />
                ADDITIONAL HIGH-IMPACT PROMOTIONS
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">
                Targeted Placement & Sponsored Campaigns
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Boost your listing or event to top-of-category, curated weekend collections, or native feeds with 100% transparent sponsored labeling.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotionPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                        {pkg.durationDays} Days Duration
                      </span>
                      <span className="text-base font-extrabold text-neutral-900">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <h3 className="font-bold text-neutral-900 text-base">{pkg.name}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{pkg.description}</p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">Placement: {pkg.placement}</span>
                    <Link
                      to={ROUTES.BUSINESS_DASHBOARD}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      Book <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transparent Trust & Policy Banner */}
        <div className="mt-12 rounded-3xl bg-neutral-900 text-white p-8 md:p-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <BadgeCheck className="h-5 w-5" />
                <span>Ethical Sponsored Marking</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                All paid placements and sponsored listings are clearly labeled. We never mislead explorers or compromise editorial ranking trust.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <PhoneCall className="h-5 w-5" />
                <span>Direct Lead Attribution</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Track exact phone calls, directions started, and WhatsApp chats. Receive authentic customer leads without middleman commissions.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <TrendingUp className="h-5 w-5" />
                <span>Cancel Anytime Guarantee</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                No locked contracts. Switch between monthly or annual billing seamlessly with self-serve billing controls.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
