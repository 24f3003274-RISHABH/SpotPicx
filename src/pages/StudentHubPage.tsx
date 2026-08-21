import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Home,
  BookOpen,
  Coffee,
  Utensils,
  Briefcase,
  Layers,
  Sparkles,
  Train,
  DollarSign,
  Search,
  CheckCircle2,
  Building2,
  Percent,
  ArrowUpRight,
  MapPin,
  Star,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { discoveryService } from '../services/discoveryService';
import { SEOHead } from '../components/seo/SEOHead';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { Business, JobItem } from '../types';

const STUDENT_CATEGORIES = [
  { label: 'All Student Spots', value: 'all', icon: Layers },
  { label: 'PGs & Hostels', value: 'pgs', icon: Home },
  { label: 'Libraries & Study', value: 'libraries', icon: BookOpen },
  { label: 'Study Cafes (Wi-Fi)', value: 'study-cafes', icon: Coffee },
  { label: 'Cheap Street Food', value: 'cheap-food', icon: Utensils },
  { label: 'Coaching & Test Prep', value: 'coaching', icon: GraduationCap },
  { label: 'Internships', value: 'internships', icon: Briefcase },
  { label: 'Part-time Jobs', value: 'jobs', icon: Briefcase },
];

const COLLEGE_HUBS = [
  { label: 'All Colleges / Delhi NCR', value: 'all' },
  { label: 'DU North Campus (GTB/Kamla)', value: 'north-campus' },
  { label: 'DU South Campus (Satya Niketan)', value: 'south-campus' },
  { label: 'IIT Delhi / Hauz Khas', value: 'iit-delhi' },
];

export const StudentHubPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [studentFriendlyOnly, setStudentFriendlyOnly] = useState<boolean>(false);
  const [budgetOnly, setBudgetOnly] = useState<boolean>(false);
  const [nearMetroOnly, setNearMetroOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: [
      'student-discovery',
      selectedCategory,
      selectedCollege,
      studentFriendlyOnly,
      budgetOnly,
      nearMetroOnly,
      searchQuery,
    ],
    queryFn: () =>
      discoveryService.getStudentDiscovery({
        category: selectedCategory,
        college: selectedCollege,
        studentFriendlyOnly,
        budgetOnly,
        nearMetroOnly,
        query: searchQuery.trim() || undefined,
      }),
  });

  const isJobsView = selectedCategory === 'internships' || selectedCategory === 'jobs';
  const items = data?.items || [];
  const studentOffers = data?.studentOffers || [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <SEOHead
        title="Student Discovery Hub - PGs, Study Cafes, Cheap Food & Internships | SpotPicks"
        description="The ultimate Delhi NCR student guide: top verified PGs, air-conditioned libraries, study cafes with high-speed Wi-Fi, late night street food, and college internships."
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white pt-10 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <Container size="xl" className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <GraduationCap className="h-4 w-4 text-indigo-400" />
            <span>Delhi NCR Student Living & Discovery Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Student Life, Simplified.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Find budget PGs near North and South Campus, discover silent study libraries, late-night chai joints under ₹100, and lucrative internships.
          </p>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setStudentFriendlyOnly(!studentFriendlyOnly)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                studentFriendlyOnly
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Student Friendly Only</span>
            </button>

            <button
              onClick={() => setBudgetOnly(!budgetOnly)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                budgetOnly
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" />
              <span>Budget (Under ₹300)</span>
            </button>

            <button
              onClick={() => setNearMetroOnly(!nearMetroOnly)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                nearMetroOnly
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Train className="h-3.5 w-3.5" />
              <span>Near Metro</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Main Filter Section */}
      <Container size="xl" className="mt-8 space-y-8">
        {/* Category Horizontal Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {STUDENT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by spot name, locality, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-700 font-semibold focus:outline-none"
            >
              {COLLEGE_HUBS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exclusive Student Deals Strip */}
        {studentOffers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Percent className="h-4 w-4 text-amber-500" />
                <span>Verified Student Discounts & Concessions</span>
              </h2>
              <Link to="/offers" className="text-xs font-bold text-indigo-600 hover:underline">
                View All Deals →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {studentOffers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-2 hover:shadow-md transition"
                >
                  <div>
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      {offer.discount}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{offer.title}</h3>
                    <p className="text-[11px] text-slate-500">{offer.business?.name}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-amber-900 bg-amber-50/70 p-1.5 rounded-lg border border-dashed border-amber-200">
                    <span>{offer.couponCode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>
              Showing <strong className="text-slate-900">{data?.total || 0}</strong> verified student spots
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-72 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : isJobsView ? (
            /* Jobs / Internships View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(items as JobItem[]).map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-500/40 hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {job.type}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{job.title}</h3>
                        <p className="text-xs text-slate-500">{job.company}</p>
                      </div>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        {job.salary}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((s) => (
                        <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-medium">{job.location}</span>
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      <span>Apply Now</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Standard Business Spots Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(items as Business[]).map((biz) => (
                <BusinessCard key={biz._id || biz.id} business={biz} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
