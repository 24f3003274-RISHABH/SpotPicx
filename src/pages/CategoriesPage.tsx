import React from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Building2,
  Landmark,
  ShoppingBag,
  Wrench,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Compass,
  Layers,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { useCategories } from '../hooks/useDiscovery';

const iconMap: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="h-6 w-6" />,
  Building2: <Building2 className="h-6 w-6" />,
  Landmark: <Landmark className="h-6 w-6" />,
  ShoppingBag: <ShoppingBag className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
};

export const CategoriesPage: React.FC = () => {
  const { data: allCategories, isLoading } = useCategories();

  const rootCategories = allCategories?.filter((c) => c.type === 'ROOT' || !c.parent) || [];
  const subCategories = allCategories?.filter((c) => c.type !== 'ROOT' && Boolean(c.parent)) || [];

  return (
    <div className="py-8 md:py-12 space-y-12 pb-20">
      <Container size="xl">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <Layers className="h-3.5 w-3.5" />
            <span>SpotPicks Discovery Taxonomy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore All Categories in Delhi NCR
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Browse through food, cafes, verified student housing, tech repair centers, historical monuments, and education institutes.
          </p>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {rootCategories.map((rootCat) => {
              // Find child subcategories
              const children = subCategories.filter(
                (sub) =>
                  (typeof sub.parent === 'object' && sub.parent?._id === rootCat._id) ||
                  sub.parent === rootCat._id ||
                  (sub as any).parentSlug === rootCat.slug
              );

              return (
                <div
                  key={rootCat._id || rootCat.slug}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Category Image Banner */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={
                        rootCat.image ||
                        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={rootCat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/90 backdrop-blur-xs flex items-center justify-center text-white">
                          {iconMap[rootCat.icon] || <Sparkles className="h-4 w-4" />}
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight">
                          {rootCat.name}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Body & Subcategories */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rootCat.description}
                      </p>

                      {/* Subcategory pills */}
                      {children.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Subcategories:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {children.map((sub) => (
                              <Link
                                key={sub._id || sub.slug}
                                to={`/category/${sub.slug}`}
                                className="px-2.5 py-1 text-xs rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 transition-colors font-medium"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/category/${rootCat.slug}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
                      >
                        <span>View All {rootCat.name} Spots</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
};
