import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Building2, Compass, Navigation } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { useLocations } from '../hooks/useDiscovery';

export const LocationsPage: React.FC = () => {
  const { data: locations, isLoading } = useLocations();

  const city = locations?.find((l) => l.type === 'CITY') || {
    name: 'Delhi NCR',
    description: 'National Capital Territory of India and cultural discovery heart.',
  };

  const localities = locations?.filter((l) => l.type === 'LOCALITY') || [];

  return (
    <div className="py-8 md:py-12 space-y-12 pb-20">
      <Container size="xl">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Compass className="h-3.5 w-3.5" />
            <span>Multi-City Geo Hierarchy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Discover Delhi Neighborhoods & Localities
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            SpotPicks maps Delhi vibrant hubs: from historic Old Delhi street food alleys to university student enclaves and Asia largest IT markets.
          </p>
        </div>

        {/* Localities Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {localities.map((loc) => (
              <Link
                key={loc._id || loc.slug}
                to={`/location/${loc.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                    {loc.pincode && (
                      <span className="text-[11px] font-mono font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        PIN {loc.pincode}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {loc.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {loc.description || `Explore top rated spots, cafes, services and stays in ${loc.name}, Delhi.`}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <Navigation className="h-3 w-3 text-indigo-400" />
                    <span>
                      {loc.latitude.toFixed(4)}° N, {loc.longitude.toFixed(4)}° E
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Explore Locality</span>
                  <ArrowRight className="h-4 w-4 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
