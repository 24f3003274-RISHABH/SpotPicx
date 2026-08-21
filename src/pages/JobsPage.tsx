import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  Building2,
  CheckCircle2,
  GraduationCap,
  Filter,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { jobService } from '../services/job.service';
import { JobItem, JobType } from '../types';
import { SEOHead } from '../components/seo/SEOHead';

const JOB_TYPES: { label: string; value: JobType | 'all' }[] = [
  { label: 'All Openings', value: 'all' },
  { label: 'Internships', value: 'Internship' },
  { label: 'Part-time Roles', value: 'Part-time' },
  { label: 'Full-time Careers', value: 'Full-time' },
  { label: 'Freelance & Gigs', value: 'Freelance' },
];

export const JobsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<JobType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [studentOnly, setStudentOnly] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs-page', selectedType, searchQuery, studentOnly],
    queryFn: () =>
      jobService.getJobs({
        type: selectedType,
        query: searchQuery.trim() || undefined,
        tag: studentOnly ? 'student-friendly' : undefined,
      }),
  });

  const jobs = data?.jobs || [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <SEOHead
        title="Jobs & Student Internships in Delhi NCR - Tech, Media & Operations | SpotPicks"
        description="Explore paid internships, flexible campus ambassador gigs, software engineering roles, and part-time student jobs across top Delhi NCR startups and businesses."
      />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-10 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
        <Container size="xl" className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Briefcase className="h-4 w-4 text-emerald-400" />
            <span>SpotPicks Talent & Opportunity Board</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Internships & Jobs in Delhi NCR
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Kickstart your career or earn while studying. Discover verified tech internships, creative marketing roles, barista apprenticeships, and remote freelance gigs.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setStudentOnly(!studentOnly)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                studentOnly
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Student & Fresher Friendly</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Content & Filters */}
      <Container size="xl" className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Job Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {JOB_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === type.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role, company, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Results List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-36 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job: JobItem) => {
              const deadlineDate = new Date(job.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={job._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-500/40 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={
                        job.companyLogo ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'
                      }
                      alt={job.company}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
                    />

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                          {job.type}
                        </span>
                        {job.featured && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                            <Sparkles className="h-3 w-3 fill-amber-500" /> Featured
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-400">
                          Expires {deadlineDate}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          {job.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-rose-500" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="text-slate-600 font-semibold">{job.experience}</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl leading-relaxed">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Compensation & Apply CTA */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Stipend / CTC
                      </span>
                      <span className="text-sm font-black text-emerald-700">{job.salary}</span>
                    </div>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
                    >
                      <span>Apply Now</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Briefcase className="h-8 w-8 text-indigo-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No open roles found</h3>
            <p className="text-xs text-slate-500">
              Try resetting your search query or selecting another job type.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};
