import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Sparkles,
  Flame,
  Award,
  Navigation,
  DollarSign,
  Utensils,
  Landmark,
  ShoppingBag,
  Wine,
  GraduationCap,
  Calendar,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { BusinessCardSkeleton } from '../components/ui/Skeletons';
import { EmptyState } from '../components/ui/EmptyState';
import { useBusinesses, useCategories, useLocations } from '../hooks/useDiscovery';
import { POPULAR_DELHI_LOCALITIES } from '../constants/locations';
import { Business } from '../types';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('section') || 'trending';
  const localityParam = searchParams.get('locality') || '';

  const { data: businessesData, isLoading } = useBusinesses({ limit: 50 });
  const allBusinesses: Business[] = businessesData?.data || [];

  const exploreSections = [
    { id: 'trending', label: 'Trending in Delhi', icon: Flame, desc: 'Highest engagement and buzz this week' },
    { id: 'best_rated', label: 'Best Rated Spots', icon: Award, desc: 'Rated 4.7+ stars by verified reviewers' },
    { id: 'near_me', label: 'Near You (GPS)', icon: Navigation, desc: 'Spots closest to your current location' },
    { id: 'budget', label: 'Budget Friendly', icon: DollarSign, desc: 'Delicious meals and services under ₹500' },
    { id: 'food', label: 'Food & Cafes', icon: Utensils, desc: 'Himalayan cafes, bakeries, and street foods' },
    { id: 'places', label: 'Places & Heritage', icon: Landmark, desc: 'Mughal monuments, historical parks & gardens' },
    { id: 'shopping', label: 'Shopping & Bazaars', icon: ShoppingBag, desc: 'Thrift markets, Janpath handicraft & electronics' },
    { id: 'nightlife', label: 'Nightlife & Bars', icon: Wine, desc: 'Rooftops, craft breweries & speakeasies' },
    { id: 'students', label: 'Student Favorites', icon: GraduationCap, desc: 'Pocket-friendly cafes, study hubs & PGs' },
    { id: 'events', label: 'Events & Experiences', icon: Calendar, desc: 'Weekend farmers markets & cultural experiences' },
  ];

  // Filter spots by active section and locality
  const getFilteredSpots = (): Business[] => {
    let list = [...allBusinesses];

    if (localityParam) {
      list = list.filter((b) => b.locality.toLowerCase().includes(localityParam.toLowerCase()));
    }

    switch (activeSection) {
      case 'trending':
        return list.sort((a, b) => (b.popularity || 80) - (a.popularity || 80));
      case 'best_rated':
        return list.filter((b) => b.rating >= 4.6).sort((a, b) => b.rating - a.rating);
      case 'near_me':
        return list.filter((b) => b.locality === 'Majnu Ka Tilla' || b.locality === 'Connaught Place' || b.locality === 'Hauz Khas');
      case 'budget':
        return list.filter((b) => b.priceRange === 'BUDGET' || (b.tags || []).includes('budget'));
      case 'food':
        return list.filter((b) => {
          const cat = typeof b.category === 'object' ? (b.category as any)?.slug : b.category;
          return cat === 'food-and-cafes' || cat === 'food-and-dining' || (b.tags || []).includes('cafe') || (b.tags || []).includes('momos');
        });
      case 'places':
        return list.filter((b) => {
          const cat = typeof b.category === 'object' ? (b.category as any)?.slug : b.category;
          return cat === 'heritage-and-places' || (b.tags || []).includes('monument') || (b.tags || []).includes('park');
        });
      case 'shopping':
        return list.filter((b) => {
          const cat = typeof b.category === 'object' ? (b.category as any)?.slug : b.category;
          return cat === 'shopping-and-retail' || (b.tags || []).includes('shopping') || (b.tags || []).includes('electronics');
        });
      case 'nightlife':
        return list.filter((b) => {
          const cat = typeof b.category === 'object' ? (b.category as any)?.slug : b.category;
          return cat === 'nightlife-and-clubs' || (b.tags || []).includes('bar') || (b.tags || []).includes('romantic');
        });
      case 'students':
        return list.filter((b) => b.locality === 'Majnu Ka Tilla' || b.locality === 'North Campus' || (b.tags || []).includes('student') || (b.tags || []).includes('pg'));
      case 'events':
        return list.filter((b) => (b.tags || []).includes('events') || (b.tags || []).includes('market') || b.locality === 'Nizamuddin');
      default:
        return list;
    }
  };

  const filteredSpots = getFilteredSpots();
  const currentSectionObj = exploreSections.find((s) => s.id === activeSection) || exploreSections[0];

  const handleSectionChange = (sectionId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('section', sectionId);
    setSearchParams(params);
  };

  const handleLocalityFilter = (locName: string) => {
    const params = new URLSearchParams(searchParams);
    if (locName === localityParam || !locName) {
      params.delete('locality');
    } else {
      params.set('locality', locName);
    }
    setSearchParams(params);
  };

  return (
    <div className="py-8 space-y-8">
      <Container size="xl" className="space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5" /> Curated Discovery
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Explore Delhi Experiences & Spots
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Browse through themed spotlights, student hotspots, fine date nights, IT tech hubs, and peaceful heritage monuments.
          </p>
        </div>

        {/* Explore Sections Badges Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {exploreSections.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSectionChange(sec.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md scale-102'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Locality Quick Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-indigo-600" />
            <span>Filter Locality:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleLocalityFilter('')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                !localityParam
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Localities
            </button>
            {POPULAR_DELHI_LOCALITIES.slice(0, 7).map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleLocalityFilter(loc.name)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  localityParam === loc.name
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Section Heading with Count */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span>{currentSectionObj.label}</span>
              {localityParam && <span className="text-indigo-600">in {localityParam}</span>}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{currentSectionObj.desc}</p>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {filteredSpots.length} spots
          </span>
        </div>

        {/* Spots Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredSpots.length === 0 ? (
          <EmptyState
            title="No spots found in this filter"
            description="Try switching the locality filter or exploring a different curated category."
            actionLabel="Reset Locality Filter"
            onAction={() => handleLocalityFilter('')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => (
              <BusinessCard key={spot._id || spot.slug} business={spot} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
