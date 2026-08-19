import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ROUTES } from '../constants/routes';

export const CollectionsPage: React.FC = () => {
  const curatedCollections = [
    {
      id: 'col-1',
      title: 'Legendary Street Food & Momo Crawl',
      description: 'From Old Delhi paranthe wali gali to Majnu Ka Tilla authentic Tibetan laphing & steamed momos.',
      spotsCount: 14,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      badge: 'Editor Pick',
      category: 'Street Food',
    },
    {
      id: 'col-2',
      title: 'Late Night Coffee & Work Stays in South Delhi',
      description: 'Cafes and study hubs with reliable high-speed WiFi and power sockets in HKV and Saket.',
      spotsCount: 9,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
      badge: 'Student Favorite',
      category: 'Cafes & Work',
    },
    {
      id: 'col-3',
      title: 'Verified Student PGs & Hostels (North Campus)',
      description: 'Curated and verified student residences near Delhi University with verified mess and security.',
      spotsCount: 18,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
      badge: 'Verified Stays',
      category: 'PGs & Hostels',
    },
    {
      id: 'col-4',
      title: 'Nehru Place Gadget & Component Repairs',
      description: 'Trusted technicians for MacBook logic board rework, graphics card diagnostics, and mobile screens.',
      spotsCount: 11,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
      badge: 'Tech Hub',
      category: 'Repairs',
    },
  ];

  return (
    <div className="py-10 space-y-8">
      <Container size="xl" className="space-y-6">
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Curated City Guides
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Curated Delhi Collections
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Thematic lists crafted by local editors and verified community contributors.
            </p>
          </div>

          <Link to={ROUTES.EXPLORE}>
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              Explore Categories
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curatedCollections.map((col) => (
            <Card key={col.id} className="p-0 overflow-hidden border-slate-200 shadow-sm rounded-2xl flex flex-col justify-between group">
              <div className="h-48 bg-slate-100 relative">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="indigo" size="sm" className="bg-indigo-600 text-white font-bold">
                    {col.badge}
                  </Badge>
                  <Badge variant="neutral" size="sm" className="bg-white/90 backdrop-blur">
                    {col.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                    {col.spotsCount} Spots included
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{col.title}</h3>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <p className="text-xs text-slate-600 leading-relaxed">{col.description}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Curated for Delhi NCR</span>
                  <Link to={`/search?q=${encodeURIComponent(col.category)}`}>
                    <Button size="sm" variant="primary">
                      Explore Collection
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};
