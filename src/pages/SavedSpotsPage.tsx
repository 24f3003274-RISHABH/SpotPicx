import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Star, Trash2, ArrowRight } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ROUTES } from '../constants/routes';

export const SavedSpotsPage: React.FC = () => {
  const sampleSavedSpots = [
    {
      id: 'spot-1',
      title: 'AMA Cafe & Bakery',
      category: 'Food & Cafes',
      locality: 'Majnu Ka Tilla',
      city: 'Delhi',
      price: '₹600 for two',
      rating: 4.8,
      reviews: 3420,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'spot-5',
      title: 'Nehru Place Apple & Laptop Hub',
      category: 'Repair & Services',
      locality: 'Nehru Place',
      city: 'Delhi',
      price: '₹800 average service',
      rating: 4.9,
      reviews: 870,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="py-10 space-y-8">
      <Container size="xl" className="space-y-6">
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Personal Bookmarks
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Saved Spots in Delhi
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              All your favorited cafes, hostels, and service locations saved to your account.
            </p>
          </div>

          <Link to={ROUTES.EXPLORE}>
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              Discover More Spots
            </Button>
          </Link>
        </div>

        {/* Grid of Saved Spots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleSavedSpots.map((spot) => (
            <Card key={spot.id} className="p-0 overflow-hidden border-slate-200 shadow-sm rounded-2xl flex flex-col justify-between">
              <div>
                <div className="h-44 bg-slate-100 relative">
                  <img
                    src={spot.image}
                    alt={spot.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="neutral" size="sm" className="bg-white/95 backdrop-blur font-semibold">
                      {spot.category}
                    </Badge>
                  </div>
                  <button
                    type="button"
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">{spot.title}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Star className="h-3 w-3 fill-current text-emerald-600" />
                      <span>{spot.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{spot.locality}, {spot.city}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{spot.price}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{spot.reviews.toLocaleString()} reviews</span>
                <Link to={`/search?q=${encodeURIComponent(spot.title)}`}>
                  <Button size="sm" variant="primary">
                    View Spot
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};
