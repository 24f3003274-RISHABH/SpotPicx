import mongoose from 'mongoose';
import { Job, IJob, JobType } from '../models/Job';
import { dbConnection } from '../config/db';

export interface InMemoryJob {
  _id: string;
  title: string;
  slug: string;
  company: string;
  companyLogo: string;
  description: string;
  location: string;
  type: JobType;
  salary: string;
  skills: string[];
  experience: string;
  applyUrl: string;
  deadline: string;
  tags: string[];
  featured: boolean;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const SEED_JOBS: InMemoryJob[] = [
  {
    _id: 'job_1',
    title: 'Frontend React & TypeScript Intern',
    slug: 'frontend-react-typescript-intern-spotpicks',
    company: 'SpotPicks Tech Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
    description: 'Work with the core product engineering team building high-performance local discovery maps, responsive web interfaces, and interactive community tools using React, Tailwind CSS, and Vite.',
    location: 'Connaught Place / Hybrid',
    type: 'Internship',
    salary: '₹20,000 - ₹30,000 / month',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST APIs'],
    experience: 'Fresher / Student (Final Year)',
    applyUrl: 'https://careers.spotpicks.demo/frontend-intern',
    deadline: getFutureDate(25),
    tags: ['student-friendly', 'tech', 'internship', 'hybrid', 'frontend'],
    featured: true,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_2',
    title: 'Social Media & Campus Community Lead',
    slug: 'social-media-campus-community-lead-delhi',
    company: 'Dilli Vibe Media',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200',
    description: 'Drive DU North Campus & South Campus influencer partnerships, curate viral reels on hidden cafes and street food joints, and organize offline campus discovery popups.',
    location: 'North Campus, Delhi University',
    type: 'Part-time',
    salary: '₹12,000 - ₹18,000 / month',
    skills: ['Instagram Reels', 'Content Creation', 'Canva', 'Campus Marketing', 'Copywriting'],
    experience: 'College Student (Any Year)',
    applyUrl: 'https://careers.spotpicks.demo/campus-lead',
    deadline: getFutureDate(20),
    tags: ['student-friendly', 'part-time', 'marketing', 'du-campus', 'content'],
    featured: true,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_3',
    title: 'Node.js & Cloud Systems Engineer',
    slug: 'nodejs-cloud-systems-engineer-ncr',
    company: 'Nexura Cloud Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
    description: 'Design robust microservices, PostgreSQL query optimization, Redis caching pipelines, and real-time geospatial search indexes for hyper-local directory platforms.',
    location: 'Cyber City, Gurgaon / Metro Accessible',
    type: 'Full-time',
    salary: '₹8,00,000 - ₹14,00,000 / year',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Redis', 'GCP'],
    experience: '1-3 Years',
    applyUrl: 'https://careers.spotpicks.demo/backend-dev',
    deadline: getFutureDate(30),
    tags: ['tech', 'full-time', 'backend', 'cyber-city'],
    featured: false,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_4',
    title: 'Food & Lifestyle Editorial Writer',
    slug: 'food-lifestyle-editorial-writer-freelance',
    company: 'SpotPicks Magazine',
    companyLogo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200',
    description: 'Author longform culinary features, secret momo reviews, cafe roundups, and neighborhood walking guides across Old Delhi, Majnu Ka Tilla, and Hauz Khas.',
    location: 'Remote / Delhi Field Visits',
    type: 'Freelance',
    salary: '₹3,000 - ₹5,000 per feature article',
    skills: ['Journalism', 'SEO Writing', 'Food Criticism', 'Photography'],
    experience: 'Portfolio / Samples Required',
    applyUrl: 'https://careers.spotpicks.demo/editorial-writer',
    deadline: getFutureDate(40),
    tags: ['freelance', 'writing', 'food', 'remote', 'student-friendly'],
    featured: true,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_5',
    title: 'UI/UX Product Design Intern (Figma)',
    slug: 'ui-ux-product-design-intern-figma',
    company: 'DesignGrid Studio',
    companyLogo: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200',
    description: 'Craft elegant mobile-first design systems, interactive prototypes, and typography scales for lifestyle and booking applications.',
    location: 'Saket District Centre / Hybrid',
    type: 'Internship',
    salary: '₹15,000 - ₹22,000 / month',
    skills: ['Figma', 'Wireframing', 'Design Systems', 'Micro-interactions', 'User Testing'],
    experience: 'Design Student / Fresher',
    applyUrl: 'https://careers.spotpicks.demo/uiux-intern',
    deadline: getFutureDate(18),
    tags: ['internship', 'design', 'figma', 'student-friendly', 'hybrid'],
    featured: false,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_6',
    title: 'Cafe Operations & Barista Apprentice',
    slug: 'cafe-operations-barista-apprentice-south-delhi',
    company: 'Artisan Brew Roasters',
    companyLogo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200',
    description: 'Learn espresso extraction, manual pour-overs, cold brew blending, and front-of-house hospitality management in an award-winning micro-roastery.',
    location: 'Saidulajab, Saket',
    type: 'Part-time',
    salary: '₹10,000 - ₹14,000 / month + Tips & Brew Perks',
    skills: ['Hospitality', 'Coffee Brewing', 'Customer Service', 'Cash Register'],
    experience: 'No experience needed, full training provided',
    applyUrl: 'https://careers.spotpicks.demo/barista-apprentice',
    deadline: getFutureDate(15),
    tags: ['part-time', 'student-friendly', 'coffee', 'hospitality'],
    featured: false,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const inMemoryJobs: Map<string, InMemoryJob> = new Map();
SEED_JOBS.forEach((j) => inMemoryJobs.set(j._id, j));

export interface JobFilterParams {
  type?: JobType | 'all';
  skill?: string;
  location?: string;
  query?: string;
  tag?: string;
  status?: string;
  limit?: number;
  page?: number;
}

export class JobService {
  public static async getJobs(params: JobFilterParams = {}) {
    const {
      type = 'all',
      skill,
      location,
      query,
      tag,
      status = 'ACTIVE',
      limit = 20,
      page = 1,
    } = params;

    const filterFn = (j: InMemoryJob) => {
      if (status && status !== 'ALL' && j.status !== status) return false;

      if (type && type !== 'all' && type.toLowerCase() !== 'all') {
        if (j.type.toLowerCase() !== type.toLowerCase()) return false;
      }

      if (location && location !== 'all') {
        if (!j.location.toLowerCase().includes(location.toLowerCase())) return false;
      }

      if (skill) {
        const s = skill.toLowerCase();
        if (!j.skills.some((sk) => sk.toLowerCase().includes(s))) return false;
      }

      if (tag) {
        if (!j.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      }

      if (query) {
        const q = query.toLowerCase();
        const match =
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    };

    if (dbConnection.getStatus().isConnected) {
      try {
        const mongoQuery: any = {};
        if (status && status !== 'ALL') mongoQuery.status = status;
        if (type && type !== 'all') mongoQuery.type = type;
        if (location && location !== 'all') mongoQuery.location = new RegExp(location, 'i');
        if (tag) mongoQuery.tags = tag;
        if (query) {
          mongoQuery.$or = [
            { title: new RegExp(query, 'i') },
            { company: new RegExp(query, 'i') },
            { description: new RegExp(query, 'i') },
            { skills: new RegExp(query, 'i') },
          ];
        }

        const jobs = await Job.find(mongoQuery)
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip((page - 1) * limit)
          .lean();

        if (jobs && jobs.length > 0) {
          return {
            jobs,
            total: await Job.countDocuments(mongoQuery),
            page,
            limit,
          };
        }
      } catch (err) {
        console.warn('MongoDB Job query fallback to memory:', err);
      }
    }

    const all = Array.from(inMemoryJobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const filtered = all.filter(filterFn);
    const startIdx = (page - 1) * limit;

    return {
      jobs: filtered.slice(startIdx, startIdx + limit),
      total: filtered.length,
      page,
      limit,
    };
  }

  public static async getJobBySlug(slugOrId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        let job = null;
        if (mongoose.Types.ObjectId.isValid(slugOrId)) {
          job = await Job.findById(slugOrId).lean();
        }
        if (!job) {
          job = await Job.findOne({ slug: slugOrId }).lean();
        }
        if (job) return job;
      } catch (err) {
        console.warn('MongoDB single job fallback:', err);
      }
    }

    return (
      inMemoryJobs.get(slugOrId) ||
      Array.from(inMemoryJobs.values()).find((j) => j.slug === slugOrId) ||
      null
    );
  }

  public static async createJob(data: Partial<InMemoryJob>) {
    const slug = (data.title || 'job')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (dbConnection.getStatus().isConnected) {
      const created = await Job.create({
        ...data,
        slug,
      });
      return created.toObject();
    }

    const _id = `job_${Date.now()}`;
    const newJob: InMemoryJob = {
      _id,
      title: data.title || 'Untitled Opportunity',
      slug,
      company: data.company || 'Delhi NCR Enterprise',
      companyLogo: data.companyLogo || '',
      description: data.description || '',
      location: data.location || 'Delhi NCR',
      type: data.type || 'Internship',
      salary: data.salary || 'Competitive',
      skills: data.skills || [],
      experience: data.experience || 'Fresher / Student',
      applyUrl: data.applyUrl || 'https://spotpicks.demo/apply',
      deadline: data.deadline || getFutureDate(30),
      tags: data.tags || ['student-friendly'],
      featured: !!data.featured,
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryJobs.set(_id, newJob);
    return newJob;
  }
}
