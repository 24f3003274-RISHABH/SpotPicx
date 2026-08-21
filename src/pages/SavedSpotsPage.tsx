import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Star, Trash2, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { EmptyState } from '../components/ui/EmptyState';
import { useSavedStore } from '../store/useSavedStore';
import { ROUTES } from '../constants/routes';

export const SavedSpotsPage: React.FC = () => {
  const { savedSpots, clearSaved } = useSavedStore();

  return (
    <div className="py-10 space-y-8">
      <Container size="xl" className="space-y-6">
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5" /> Personal Bookmarks
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Saved Spots in Delhi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              All your favorited cafes, hostels, date spots, and service centers saved for quick access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedSpots.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearSaved}>
                Clear All
              </Button>
            )}
            <Link to={ROUTES.EXPLORE}>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Discover More Spots
              </Button>
            </Link>
          </div>
        </div>

        {/* Saved spots list */}
        {savedSpots.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-7 w-7 text-rose-500" />}
            title="No Saved Spots Yet"
            description="Tap the heart icon on any card or business detail page to bookmark your favorite places across Delhi NCR."
            actionLabel="Explore Trending Spots"
            onAction={() => window.location.assign(ROUTES.HOME)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSpots.map((spot) => (
              <BusinessCard key={spot._id || spot.slug} business={spot} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
