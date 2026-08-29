import { apiClient } from '../api/apiClient';
import { Article } from '../types';

const FALLBACK_ARTICLES: Record<string, Article> = {
  'best-internship-websites-for-college-students': {
    _id: 'art-best-internship-websites',
    id: 'art-best-internship-websites',
    title: 'Best Places to Find Internships & Jobs for College Students',
    slug: 'best-internship-websites-for-college-students',
    excerpt: 'The definitive searchable directory of verified, high-yield platforms for Software, Data Science, AI/ML, Startups, Remote Work, Government, Research Fellowships, and Open Source programs.',
    content: 'Comprehensive directory of reliable internship platforms, application playbooks, and common application mistakes to avoid.',
    coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200',
    author: 'SpotPicks Student Career Desk',
    authorRole: 'Head of Career Intelligence',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    category: 'Student Guides',
    tags: ['Internships', 'College Students', 'Software Jobs', 'Data Science', 'AI/ML', 'Remote Work', 'Research Fellowships', 'Open Source', 'Government Jobs', 'Freelancing'],
    locations: ['Delhi NCR', 'India', 'Global'],
    seoTitle: 'Best Places to Find Internships & Jobs for College Students (2026) | SpotPicks',
    seoDescription: 'Discover the most reliable platforms for student internships: Software, AI/ML, YC Startups, Remote, GSoC, Mitacs research, and Government portals with application playbooks.',
    published: true,
    publishedAt: '2026-08-29T00:00:00Z',
    readingTimeMinutes: 9,
    featured: true,
    createdAt: '2026-08-29T00:00:00Z',
    updatedAt: '2026-08-29T00:00:00Z',
  },
  'free-websites-every-college-student-should-know': {
    _id: 'art-free-websites-college',
    id: 'art-free-websites-college',
    title: '25 Free Websites Every College Student Should Know',
    slug: 'free-websites-every-college-student-should-know',
    excerpt: 'The ultimate curated directory of 25+ essential, verified free websites for college students covering Coding, DSA, AI/ML, CS, Mathematics, Resumes, Certifications, Research, and Internships.',
    content: 'Full comprehensive directory of 25+ free tools with category filtering and official links.',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
    author: 'SpotPicks Academic & Career Desk',
    authorRole: 'Head of Student Resources',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    category: 'Student Guides',
    tags: ['College Life', 'Free Tools', 'Coding', 'DSA', 'Resume', 'Scholarships', 'Internships', 'Mathematics', 'AI'],
    locations: ['Delhi NCR', 'India', 'Global'],
    seoTitle: '25 Free Websites Every College Student Should Know (2026) | SpotPicks',
    seoDescription: 'Explore the 25 essential free websites every college student needs: coding, DSA, free GPUs, resume builders, academic research, and student discounts.',
    published: true,
    publishedAt: '2026-08-29T00:00:00Z',
    readingTimeMinutes: 10,
    featured: true,
    createdAt: '2026-08-29T00:00:00Z',
    updatedAt: '2026-08-29T00:00:00Z',
  },
  'top-10-github-repositories-every-student-should-know': {
    _id: 'art-github-repos',
    id: 'art-github-repos',
    title: 'Top 10 GitHub Repositories Every Computer Science Student Should Know',
    slug: 'top-10-github-repositories-every-student-should-know',
    excerpt: 'The definitive curated guide to 10 foundational open-source repositories covering Data Structures & Algorithms, Web Architecture, System Design, Generative AI, Machine Learning, and DevOps.',
    content: 'Top 10 GitHub repositories with live stats, star benchmarks, and domain roadmaps.',
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200',
    author: 'SpotPicks Tech & Engineering Desk',
    authorRole: 'Chief Technology Curator',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    category: 'Student Guides',
    tags: ['GitHub', 'Computer Science', 'DSA', 'System Design', 'Open Source', 'Web Development', 'Machine Learning', 'AI', 'DevOps'],
    locations: ['Delhi NCR', 'India', 'Global'],
    seoTitle: 'Top 10 GitHub Repositories Every Computer Science Student Should Know (2026) | SpotPicks',
    seoDescription: 'Discover the top 10 GitHub repositories every computer science student must know: DSA, System Design, Web Dev, Generative AI, and Open Source guides with live stats.',
    published: true,
    publishedAt: '2026-02-28T00:00:00Z',
    readingTimeMinutes: 8,
    featured: true,
    createdAt: '2026-02-28T00:00:00Z',
    updatedAt: '2026-02-28T00:00:00Z',
  },
  'best-ai-tools-for-college-students-2026': {
    _id: 'art-ai-tools-2026',
    id: 'art-ai-tools-2026',
    title: '20 AI Tools Every College Student Should Know in 2026',
    slug: 'best-ai-tools-for-college-students-2026',
    excerpt: 'The ultimate verified guide to 20 game-changing AI tools for studying, coding, research, writing, presentations, note-taking, and career building in 2026.',
    content: 'Benchmark guide to 20 AI tools for college students across 10 categories with pricing and limitations.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
    author: 'SpotPicks Tech & Academic Desk',
    authorRole: 'Head of Academic Technology',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    category: 'Student Guides',
    tags: ['AI Tools', 'College Students', 'Studying', 'Coding', 'Research', 'Writing', 'Presentations', 'Note Taking', 'Productivity', 'Resume Building', 'Data Analysis'],
    locations: ['Delhi NCR', 'India', 'Global'],
    seoTitle: '20 AI Tools Every College Student Should Know in 2026 | SpotPicks',
    seoDescription: 'The definitive guide to the best AI tools for college students: NotebookLM, Cursor, Consensus, Claude, Gamma, Teal, and Julius AI with verified free tiers and use cases.',
    published: true,
    publishedAt: '2026-08-29T00:00:00Z',
    readingTimeMinutes: 10,
    featured: true,
    createdAt: '2026-08-29T00:00:00Z',
    updatedAt: '2026-08-29T00:00:00Z',
  },
};

export const articleService = {
  /**
   * Get all published articles with optional filters
   */
  async getAllArticles(params: { category?: string; tag?: string; location?: string; search?: string } = {}): Promise<Article[]> {
    try {
      const response: any = await apiClient.get('/articles', { params });
      const apiArticles = response?.data?.articles || response?.data || (Array.isArray(response) ? response : []);
      if (apiArticles.length > 0) return apiArticles;
    } catch (e) {
      console.warn('Failed to fetch articles from API, using curated fallbacks:', e);
    }
    return Object.values(FALLBACK_ARTICLES);
  },

  /**
   * Get single article by slug with JSON-LD schema
   */
  async getArticleBySlug(slug: string): Promise<{ article: Article; jsonLd?: any } | null> {
    const cleanSlug = slug.toLowerCase().trim();
    try {
      const response: any = await apiClient.get(`/articles/${cleanSlug}`);
      if (response?.data?.article) return response.data;
      if (response?.article) return response;
      if (response?.data) return { article: response.data };
    } catch (e) {
      console.warn(`Failed to fetch article /${cleanSlug}:`, e);
    }

    if (
      cleanSlug === 'best-internship-websites-for-college-students' ||
      cleanSlug === 'best-places-to-find-internships-for-college-students' ||
      cleanSlug === 'top-internship-websites-for-college-students' ||
      cleanSlug === 'best-internship-websites' ||
      cleanSlug === 'internship-websites-for-students'
    ) {
      return { article: FALLBACK_ARTICLES['best-internship-websites-for-college-students'] };
    }

    if (
      cleanSlug === 'free-websites-every-college-student-should-know' ||
      cleanSlug === '25-free-websites-every-college-student-should-know' ||
      cleanSlug === 'top-free-websites-for-college-students' ||
      cleanSlug === 'free-websites-every-student-should-know'
    ) {
      return { article: FALLBACK_ARTICLES['free-websites-every-college-student-should-know'] };
    }

    if (
      cleanSlug === 'top-10-github-repositories-every-student-should-know' ||
      cleanSlug === 'top-10-github-repositories-every-computer-science-student-should-know' ||
      cleanSlug === 'top-10-github-repos-for-cs-students'
    ) {
      return { article: FALLBACK_ARTICLES['top-10-github-repositories-every-student-should-know'] };
    }

    if (
      cleanSlug === 'best-ai-tools-for-college-students-2026' ||
      cleanSlug === '20-ai-tools-every-college-student-should-know-in-2026' ||
      cleanSlug === 'best-ai-tools-for-college-students' ||
      cleanSlug === 'top-ai-tools-for-students'
    ) {
      return { article: FALLBACK_ARTICLES['best-ai-tools-for-college-students-2026'] };
    }

    return null;
  },
};

