import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  ArrowRight,
  Sparkles,
  Utensils,
  Building2,
  Landmark,
  ShoppingBag,
  Dumbbell,
  Wrench,
  GraduationCap,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { POPULAR_CATEGORIES } from '../constants/categories';
import { POPULAR_DELHI_LOCALITIES } from '../constants/locations';
import { useFilterStore } from '../store/useFilterStore';

const iconMap: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="h-5 w-5" />,
  Building2: <Building2 className="h-5 w-5" />,
  Landmark: <Landmark className="h-5 w-5" />,
  ShoppingBag: <ShoppingBag className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  Dumbbell: <Dumbbell className="h-5 w-5" />,
  Wrench: <Wrench className="h-5 w-5" />,
  GraduationCap: <GraduationCap className="h-5 w-5" />,
};

const categoryColorStyles: Record<string, string> = {
  orange: 'bg-orange-100 text-orange-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  rose: 'bg-rose-100 text-rose-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  amber: 'bg-amber-100 text-amber-600',
};

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLocality = searchParams.get('locality') || '';
  const { setLocality } = useFilterStore();

  const handleLocalityFilter = (locId: string) => {
    if (activeLocality === locId) {
      searchParams.delete('locality');
    } else {
      searchParams.set('locality', locId);
    }
    setSearchParams(searchParams);
    setLocality(activeLocality === locId ? '' : locId);
  };

  return (
    <div className="py-8 space-y-10">
      <Container size="xl" className="space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Directory & Taxonomy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Explore All Categories in Delhi
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Browse spots by specific industry, lifestyle, or service taxonomy. Every category is powered by the unified data model.
          </p>
        </div>

        {/* Locality Filter Bar */}
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-indigo-600" /> Filter by Delhi Locality:
            </span>
            {activeLocality && (
              <button
                type="button"
                onClick={() => {
                  searchParams.delete('locality');
                  setSearchParams(searchParams);
                }}
                className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
              >
                Clear locality filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                searchParams.delete('locality');
                setSearchParams(searchParams);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                !activeLocality
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Delhi
            </button>
            {POPULAR_DELHI_LOCALITIES.map((loc) => {
              const isSelected = activeLocality === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleLocalityFilter(loc.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {loc.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_CATEGORIES.map((cat) => {
            const colorClass = categoryColorStyles[cat.color] || 'bg-indigo-100 text-indigo-600';
            return (
              <Card
                key={cat.id}
                className="p-6 border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between rounded-2xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}>
                      {iconMap[cat.iconName] || <Sparkles className="h-6 w-6" />}
                    </div>
                    <Badge variant="neutral">{cat.countLabel}</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{cat.description}</p>
                  </div>

                  {/* Popular sample query pills */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Popular searches:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.searchPhrases.map((phrase, idx) => (
                        <Link
                          key={idx}
                          to={`/search?q=${encodeURIComponent(phrase)}${
                            activeLocality ? `&locality=${activeLocality}` : ''
                          }`}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-slate-600 transition-colors font-medium"
                        >
                          {phrase}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/search?category=${cat.id}${activeLocality ? `&locality=${activeLocality}` : ''}`}
                    className="w-full"
                  >
                    <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                      Browse {cat.name}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
