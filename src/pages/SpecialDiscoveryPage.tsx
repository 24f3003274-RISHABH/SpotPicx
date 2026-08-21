import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Heart,
  Users,
  Smile,
  User,
  GraduationCap,
  DollarSign,
  Crown,
  Compass,
  Sparkles,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { discoveryService } from '../services/discoveryService';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { SEOHead } from '../components/seo/SEOHead';
import { SpecialIntentType } from '../types';

const INTENT_TABS: { label: string; value: SpecialIntentType; icon: any; color: string }[] = [
  { label: 'For Couples (Date Night)', value: 'couples', icon: Heart, color: 'text-rose-500' },
  { label: 'For Families', value: 'families', icon: Users, color: 'text-emerald-500' },
  { label: 'With Friends & Groups', value: 'friends', icon: Smile, color: 'text-amber-500' },
  { label: 'Solo & Work Escapes', value: 'solo', icon: User, color: 'text-cyan-500' },
  { label: 'Student Hub', value: 'students', icon: GraduationCap, color: 'text-indigo-500' },
  { label: 'Pocket Budget (<₹300)', value: 'budget', icon: DollarSign, color: 'text-green-500' },
  { label: 'Luxury & Fine Dining', value: 'luxury', icon: Crown, color: 'text-purple-500' },
  { label: 'Secret Hidden Gems', value: 'hidden-gems', icon: Compass, color: 'text-rose-600' },
];

export const SpecialDiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const intentParam = (searchParams.get('intent') as SpecialIntentType) || 'couples';

  const [activeIntent, setActiveIntent] = useState<SpecialIntentType>(intentParam);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (intentParam && intentParam !== activeIntent) {
      setActiveIntent(intentParam);
    }
  }, [intentParam]);

  const handleSelectIntent = (intent: SpecialIntentType) => {
    setActiveIntent(intent);
    setSearchParams({ intent });
  };

  const { data, isLoading } = useQuery({
    queryKey: ['special-discovery', activeIntent, searchQuery],
    queryFn: () =>
      discoveryService.getSpecialDiscovery({
        intent: activeIntent,
        query: searchQuery.trim() || undefined,
      }),
  });

  const spots = data?.items || [];
  const meta = data?.meta || {
    title: 'Curated Delhi NCR Discovery',
    tagline: 'Hand-picked spots for every lifestyle and occasion.',
    curatorNote: 'Verified for authentic experience and high ratings.',
    recommendedTags: [],
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <SEOHead
        title={`${meta.title} - SpotPicks Delhi NCR Discovery`}
        description={`${meta.tagline} Discover handpicked recommendations in Delhi NCR.`}
      />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white pt-10 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:18px_18px]" />
        <Container size="xl" className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Intent & Vibe Discovery Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            {meta.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {meta.tagline}
          </p>

          {/* Curator Note Banner */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 max-w-2xl flex items-start gap-2.5 text-xs text-slate-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-white font-bold">Curator Note:</strong> {meta.curatorNote}
            </span>
          </div>
        </Container>
      </section>

      {/* Intent Navigation Pills */}
      <Container size="xl" className="mt-8 space-y-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INTENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeIntent === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleSelectIntent(tab.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Tag Recommendations */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search spots by name, locality or amenity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {meta.recommendedTags && meta.recommendedTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Vibe Tags:
              </span>
              {meta.recommendedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>
              Showing <strong className="text-slate-900">{data?.total || 0}</strong> hand-curated places
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-72 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : spots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spots.map((spot) => (
                <BusinessCard key={spot._id || spot.id} business={spot} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Compass className="h-8 w-8 text-rose-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No spots found</h3>
              <p className="text-xs text-slate-500">
                Try searching with different terms or select another vibe from above.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
