import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Tag,
  Percent,
  Sparkles,
  Search,
  Copy,
  Check,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Flame,
  Info,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { offerService } from '../services/offerService';
import { SEOHead } from '../components/seo/SEOHead';
import { OfferItem } from '../types';

const OFFER_CATEGORIES = [
  'All Offers',
  'Cafes & Bakeries',
  'Food & Dining',
  'PGs & Hostels',
  'Education & Coaching',
  'Services & Repairs',
];

export const OffersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Offers');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['public-offers', selectedCategory, searchQuery],
    queryFn: () =>
      offerService.getPublicOffers({
        category: selectedCategory !== 'All Offers' ? selectedCategory : undefined,
        query: searchQuery.trim() || undefined,
      }),
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <SEOHead
        title="Exclusive Offers & Deals in Delhi NCR - Food, Cafes, Hostels & Services | SpotPicks"
        description="Claim verified discounts, flat concession coupons, and student promo codes from top-rated restaurants, study cafes, PGs, and local hubs in Delhi."
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 text-white pt-10 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px] opacity-15" />
        <Container size="xl" className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20">
            <Percent className="h-3.5 w-3.5" />
            <span>SpotPicks Verified Savings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Deals, Promos & Student Discounts
          </h1>
          <p className="text-sm sm:text-base text-amber-100 max-w-2xl">
            Save big across your favorite Delhi NCR coffee roasteries, student hostels, coaching institutes, and authentic street dining spots.
          </p>
        </Container>
      </section>

      {/* Filter and Search Bar */}
      <Container size="xl" className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {OFFER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand or offer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Offer Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer: OfferItem) => {
              const businessName = offer.business?.name || 'Local Establishment';
              const businessSlug = offer.business?.slug;
              const businessLocality = offer.business?.locality || 'Delhi NCR';

              const validDate = new Date(offer.validUntil).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isCopied = copiedCode === offer.couponCode;

              return (
                <div
                  key={offer._id}
                  className="group bg-white rounded-3xl border border-slate-200 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Top Badge Strip */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Percent className="h-4 w-4" />
                      <span className="text-xs font-black uppercase tracking-wider">
                        {offer.discount}
                      </span>
                    </div>
                    {offer.claimedCount ? (
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                        {offer.claimedCount} claims
                      </span>
                    ) : null}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 space-y-4">
                    <div className="space-y-1">
                      {businessSlug ? (
                        <Link
                          to={`/biz/${businessSlug}`}
                          className="text-xs font-bold text-slate-500 hover:text-amber-600 flex items-center gap-1 transition"
                        >
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{businessName}</span>
                          <span className="text-slate-400">• {businessLocality}</span>
                        </Link>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{businessName}</span>
                        </span>
                      )}

                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition">
                        {offer.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {offer.description}
                    </p>

                    {/* Terms Preview */}
                    {offer.terms && offer.terms.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Info className="h-3 w-3" /> Terms
                        </span>
                        <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                          {offer.terms.slice(0, 2).map((term, i) => (
                            <li key={i} className="truncate">
                              {term}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Footer Coupon Action */}
                  <div className="p-5 pt-0 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Valid until {validDate}
                      </span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Promo Code Box */}
                      <div className="flex-1 bg-amber-50 border border-dashed border-amber-300 rounded-xl px-3 py-2 flex items-center justify-between font-mono text-xs font-black text-amber-900 tracking-wider">
                        <span>{offer.couponCode}</span>
                        <button
                          onClick={() => handleCopyCode(offer.couponCode)}
                          className="text-amber-700 hover:text-amber-900 transition flex items-center gap-1 text-[11px] font-sans font-bold"
                          title="Copy promo code"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {businessSlug && (
                        <Link
                          to={`/biz/${businessSlug}`}
                          className="p-2 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-xl transition"
                          title="View Business"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Tag className="h-8 w-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No active offers found</h3>
            <p className="text-xs text-slate-500">
              No promotions matching your search criteria at the moment. Try selecting a different category.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};
