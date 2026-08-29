import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  Share2,
  Bookmark,
  ChevronRight,
  BookOpen,
  User,
  Sparkles,
  MapPin,
  Star,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { articleService } from '../services/article.service';
import { Article } from '../types';
import { GitHubReposEditorialGuide } from '../components/articles/GitHubReposEditorialGuide';
import { GITHUB_REPOSITORIES_LIST } from '../data/githubReposData';
import { FreeWebsitesEditorialGuide } from '../components/articles/FreeWebsitesEditorialGuide';
import { FREE_WEBSITES_LIST, EDITORIAL_FAQS } from '../data/freeWebsitesData';
import { InternshipPlatformsEditorialGuide } from '../components/articles/InternshipPlatformsEditorialGuide';
import { INTERNSHIP_PLATFORMS_LIST, INTERNSHIP_FAQS } from '../data/internshipsData';
import { AiToolsEditorialGuide } from '../components/articles/AiToolsEditorialGuide';
import { AI_TOOLS_LIST, AI_TOOLS_FAQS } from '../data/aiToolsData';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [jsonLd, setJsonLd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const isAiToolsGuide =
    slug === 'best-ai-tools-for-college-students-2026' ||
    slug === 'best-ai-tools-for-college-students' ||
    slug === '20-ai-tools-every-college-student-should-know-in-2026' ||
    slug === 'top-ai-tools-for-students' ||
    slug === 'best-ai-tools-for-students' ||
    article?.slug === 'best-ai-tools-for-college-students-2026';

  const isGitHubReposGuide =
    slug === 'top-10-github-repositories-every-student-should-know' ||
    slug === 'top-10-github-repositories-every-computer-science-student-should-know' ||
    article?.slug === 'top-10-github-repositories-every-student-should-know';

  const isFreeWebsitesGuide =
    slug === 'free-websites-every-college-student-should-know' ||
    slug === '25-free-websites-every-college-student-should-know' ||
    slug === 'top-free-websites-for-college-students' ||
    article?.slug === 'free-websites-every-college-student-should-know';

  const isInternshipWebsitesGuide =
    slug === 'best-internship-websites-for-college-students' ||
    slug === 'best-places-to-find-internships-for-college-students' ||
    slug === 'top-internship-websites-for-college-students' ||
    article?.slug === 'best-internship-websites-for-college-students';

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadArticle() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await articleService.getArticleBySlug(slug);
        if (isMounted) {
          if (res) {
            setArticle(res.article);
            
            // Build rich JSON-LD for Search Engine Optimization
            if (
              slug === 'free-websites-every-college-student-should-know' ||
              slug === '25-free-websites-every-college-student-should-know' ||
              res.article?.slug === 'free-websites-every-college-student-should-know'
            ) {
              const enhancedJsonLd = [
                {
                  '@context': 'https://schema.org',
                  '@type': 'TechArticle',
                  headline: '25 Free Websites Every College Student Should Know',
                  description: 'The ultimate curated directory of 25+ essential, verified free websites for college students covering Coding, DSA, AI/ML, CS, Mathematics, Resumes, Certifications, Research, and Internships.',
                  image: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200'],
                  author: {
                    '@type': 'Organization',
                    name: 'SpotPicks Editorial Team',
                    url: 'https://spotpicks.delhi',
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'SpotPicks Delhi',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://spotpicks.delhi/favicon.ico',
                    },
                  },
                  datePublished: '2026-08-29T00:00:00Z',
                  dateModified: new Date().toISOString(),
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': 'https://spotpicks.delhi/articles/free-websites-every-college-student-should-know',
                  },
                  keywords: 'Free Student Websites, Coding Resources, DSA, Machine Learning, Resume Builder, Scholarships, College Tools, Free Certifications',
                  proficiencyLevel: 'All Levels',
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'ItemList',
                  name: '25 Free Websites Every College Student Should Know',
                  itemListElement: FREE_WEBSITES_LIST.map((site, idx) => ({
                    '@type': 'ListItem',
                    position: idx + 1,
                    name: site.name,
                    url: site.url,
                    description: site.shortDescription,
                  })),
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: EDITORIAL_FAQS.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: faq.answer,
                    },
                  })),
                },
              ];
              setJsonLd(enhancedJsonLd);
            } else if (
              slug === 'top-10-github-repositories-every-student-should-know' ||
              slug === 'top-10-github-repositories-every-computer-science-student-should-know' ||
              res.article?.slug === 'top-10-github-repositories-every-student-should-know'
            ) {
              const enhancedJsonLd = [
                {
                  '@context': 'https://schema.org',
                  '@type': 'TechArticle',
                  headline: 'Top 10 GitHub Repositories Every Computer Science Student Should Know',
                  description: 'The definitive curated guide to 10 foundational open-source repositories covering Data Structures & Algorithms, Web Architecture, System Design, Generative AI, Machine Learning, and DevOps.',
                  image: ['https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200'],
                  author: {
                    '@type': 'Organization',
                    name: 'SpotPicks Editorial Team',
                    url: 'https://spotpicks.delhi',
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'SpotPicks Delhi',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://spotpicks.delhi/favicon.ico',
                    },
                  },
                  datePublished: '2026-02-28T00:00:00Z',
                  dateModified: new Date().toISOString(),
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': 'https://spotpicks.delhi/articles/top-10-github-repositories-every-student-should-know',
                  },
                  keywords: 'GitHub, Computer Science, DSA, System Design, Generative AI, Open Source, DevOps, Web Development',
                  proficiencyLevel: 'Beginner to Advanced',
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'ItemList',
                  name: 'Top 10 GitHub Repositories for Computer Science Students',
                  itemListElement: GITHUB_REPOSITORIES_LIST.map((repo, idx) => ({
                    '@type': 'ListItem',
                    position: idx + 1,
                    name: repo.name,
                    url: repo.githubUrl,
                    description: repo.shortDescription,
                  })),
                },
              ];
              setJsonLd(enhancedJsonLd);
            } else if (
              slug === 'best-internship-websites-for-college-students' ||
              slug === 'best-places-to-find-internships-for-college-students' ||
              slug === 'top-internship-websites-for-college-students' ||
              res.article?.slug === 'best-internship-websites-for-college-students'
            ) {
              const enhancedJsonLd = [
                {
                  '@context': 'https://schema.org',
                  '@type': 'TechArticle',
                  headline: 'Best Places to Find Internships & Jobs for College Students',
                  description: 'The definitive searchable directory of verified, high-yield platforms for Software, Data Science, AI/ML, Startups, Remote Work, Government, Research Fellowships, and Open Source programs.',
                  image: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200'],
                  author: {
                    '@type': 'Organization',
                    name: 'SpotPicks Student Career Desk',
                    url: 'https://spotpicks.delhi',
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'SpotPicks Delhi',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://spotpicks.delhi/favicon.ico',
                    },
                  },
                  datePublished: '2026-08-29T00:00:00Z',
                  dateModified: new Date().toISOString(),
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': 'https://spotpicks.delhi/articles/best-internship-websites-for-college-students',
                  },
                  keywords: 'Student Internships, Software Jobs, Remote Internships, YC Startups, AI ML Jobs, Research Fellowships, GSoC, Mitacs, AICTE Portal, LinkedIn Referrals',
                  proficiencyLevel: 'Beginner to Advanced',
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'ItemList',
                  name: 'Best Places to Find Internships & Jobs for College Students',
                  itemListElement: INTERNSHIP_PLATFORMS_LIST.map((platform, idx) => ({
                    '@type': 'ListItem',
                    position: idx + 1,
                    name: platform.name,
                    url: platform.url,
                    description: platform.shortDescription,
                  })),
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: INTERNSHIP_FAQS.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: faq.answer,
                    },
                  })),
                },
              ];
              setJsonLd(enhancedJsonLd);
            } else if (
              slug === 'best-ai-tools-for-college-students-2026' ||
              slug === 'best-ai-tools-for-college-students' ||
              slug === '20-ai-tools-every-college-student-should-know-in-2026' ||
              res.article?.slug === 'best-ai-tools-for-college-students-2026'
            ) {
              const enhancedJsonLd = [
                {
                  '@context': 'https://schema.org',
                  '@type': 'TechArticle',
                  headline: '20 AI Tools Every College Student Should Know in 2026',
                  description: 'The ultimate verified guide to 20 game-changing AI tools for studying, coding, research, writing, presentations, note-taking, and career building in 2026.',
                  image: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200'],
                  author: {
                    '@type': 'Organization',
                    name: 'SpotPicks Tech & Academic Desk',
                    url: 'https://spotpicks.delhi',
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: 'SpotPicks Delhi',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://spotpicks.delhi/favicon.ico',
                    },
                  },
                  datePublished: '2026-08-29T00:00:00Z',
                  dateModified: new Date().toISOString(),
                  mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': 'https://spotpicks.delhi/articles/best-ai-tools-for-college-students-2026',
                  },
                  keywords: 'AI Tools for College, NotebookLM, Cursor AI, Consensus, Claude, Gamma App, Teal Resume, Julius AI, Student AI Tools, Studying, Coding, Research',
                  proficiencyLevel: 'All Levels',
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'ItemList',
                  name: '20 AI Tools Every College Student Should Know in 2026',
                  itemListElement: AI_TOOLS_LIST.map((tool, idx) => ({
                    '@type': 'ListItem',
                    position: idx + 1,
                    name: tool.name,
                    url: tool.url,
                    description: tool.whatItDoes,
                  })),
                },
                {
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: AI_TOOLS_FAQS.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: faq.answer,
                    },
                  })),
                },
              ];
              setJsonLd(enhancedJsonLd);
            } else {
              setJsonLd(res.jsonLd);
            }
          } else {
            if (
              slug === 'best-ai-tools-for-college-students-2026' ||
              slug === 'best-ai-tools-for-college-students' ||
              slug === '20-ai-tools-every-college-student-should-know-in-2026'
            ) {
              setArticle({
                _id: 'ai-tools-guide-fallback',
                title: '20 AI Tools Every College Student Should Know in 2026',
                slug: 'best-ai-tools-for-college-students-2026',
                excerpt: 'The ultimate verified guide to 20 game-changing AI tools for studying, coding, research, writing, presentations, note-taking, and career building in 2026.',
                content: '',
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
                publishedAt: new Date().toISOString(),
                readingTimeMinutes: 10,
                featured: true,
              } as any);
            } else if (
              slug === 'top-10-github-repositories-every-student-should-know' ||
              slug === 'top-10-github-repositories-every-computer-science-student-should-know'
            ) {
              setArticle({
                _id: 'github-repos-fallback',
                title: 'Top 10 GitHub Repositories Every Computer Science Student Should Know',
                slug: 'top-10-github-repositories-every-student-should-know',
                excerpt: 'The definitive curated guide to 10 foundational open-source repositories covering Data Structures & Algorithms, Web Architecture, System Design, Generative AI, Machine Learning, and DevOps.',
                content: '',
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
                publishedAt: new Date().toISOString(),
                readingTimeMinutes: 8,
                featured: true,
              } as any);
            } else if (
              slug === 'free-websites-every-college-student-should-know' ||
              slug === '25-free-websites-every-college-student-should-know'
            ) {
              setArticle({
                _id: 'free-websites-fallback',
                title: '25 Free Websites Every College Student Should Know',
                slug: 'free-websites-every-college-student-should-know',
                excerpt: 'The ultimate curated directory of 25+ essential, verified free websites for college students covering Coding, DSA, AI/ML, CS, Mathematics, Resumes, Certifications, Research, and Internships.',
                content: '',
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
                publishedAt: new Date().toISOString(),
                readingTimeMinutes: 10,
                featured: true,
              } as any);
            } else if (
              slug === 'best-internship-websites-for-college-students' ||
              slug === 'best-places-to-find-internships-for-college-students'
            ) {
              setArticle({
                _id: 'internship-websites-fallback',
                title: 'Best Places to Find Internships & Jobs for College Students',
                slug: 'best-internship-websites-for-college-students',
                excerpt: 'The definitive searchable directory of verified, high-yield platforms for Software, Data Science, AI/ML, Startups, Remote Work, Government, Research Fellowships, and Open Source programs.',
                content: '',
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
                publishedAt: new Date().toISOString(),
                readingTimeMinutes: 9,
                featured: true,
              } as any);
            } else {
              setArticle(null);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        if (isMounted) {
          if (
            slug === 'best-ai-tools-for-college-students-2026' ||
            slug === 'best-ai-tools-for-college-students' ||
            slug === '20-ai-tools-every-college-student-should-know-in-2026'
          ) {
            setArticle({
              _id: 'ai-tools-guide-fallback',
              title: '20 AI Tools Every College Student Should Know in 2026',
              slug: 'best-ai-tools-for-college-students-2026',
              excerpt: 'The ultimate verified guide to 20 game-changing AI tools for studying, coding, research, writing, presentations, note-taking, and career building in 2026.',
              content: '',
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
              publishedAt: new Date().toISOString(),
              readingTimeMinutes: 10,
              featured: true,
            } as any);
          } else if (
            slug === 'top-10-github-repositories-every-student-should-know' ||
            slug === 'top-10-github-repositories-every-computer-science-student-should-know'
          ) {
            setArticle({
              _id: 'github-repos-fallback',
              title: 'Top 10 GitHub Repositories Every Computer Science Student Should Know',
              slug: 'top-10-github-repositories-every-student-should-know',
              excerpt: 'The definitive curated guide to 10 foundational open-source repositories covering Data Structures & Algorithms, Web Architecture, System Design, Generative AI, Machine Learning, and DevOps.',
              content: '',
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
              publishedAt: new Date().toISOString(),
              readingTimeMinutes: 8,
              featured: true,
            } as any);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadArticle();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading story...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[70vh] bg-slate-50 py-16 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Story Not Found</h1>
        <p className="text-slate-600 max-w-md mb-6">The article you are looking for does not exist or has moved.</p>
        <Link
          to="/articles"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
        >
          Back to Magazine
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.seoTitle || article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        canonicalUrl={`https://spotpicks.delhi/articles/${article.slug}`}
        ogImage={article.coverImage}
        ogType="article"
        keywords={article.tags}
        jsonLd={jsonLd}
      />

      {/* Hero Cover Banner */}
      <div className="relative bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-indigo-300 mb-6 flex-wrap">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/articles" className="hover:text-white transition">Magazine</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-indigo-400 font-semibold">{article.category}</span>
          </nav>

          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {article.excerpt}
            </p>

            {/* Author Meta & Controls */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={article.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={article.author}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400"
                />
                <div>
                  <strong className="text-sm text-white block font-bold">{article.author}</strong>
                  <span className="text-xs text-slate-400">{article.authorRole || 'Delhi Food & Culture Editor'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  {article.readingTimeMinutes} min read
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Feb 2026'}
                </span>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {copied ? 'Copied' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Body Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAiToolsGuide ? (
          <div className="space-y-12">
            <AiToolsEditorialGuide />

            {/* Bottom Back Button & Cross Links */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-800 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to SpotPicks Magazine & Guides
              </Link>

              <div className="flex items-center gap-4 text-xs font-bold flex-wrap">
                <Link
                  to="/articles/best-internship-websites-for-college-students"
                  className="text-slate-600 hover:text-violet-600 transition"
                >
                  Best Internship Portals
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/articles/free-websites-every-college-student-should-know"
                  className="text-slate-600 hover:text-violet-600 transition"
                >
                  25 Free Websites for Students
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/articles/top-10-github-repositories-every-student-should-know"
                  className="text-slate-600 hover:text-violet-600 transition"
                >
                  GitHub Repos Masterclass
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/students"
                  className="text-slate-600 hover:text-violet-600 transition"
                >
                  Visit Student Hub
                </Link>
              </div>
            </div>
          </div>
        ) : isInternshipWebsitesGuide ? (
          <div className="space-y-12">
            <InternshipPlatformsEditorialGuide />

            {/* Bottom Back Button & Cross Links */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to SpotPicks Magazine & Guides
              </Link>

              <div className="flex items-center gap-4 text-xs font-bold flex-wrap">
                <Link
                  to="/articles/free-websites-every-college-student-should-know"
                  className="text-slate-600 hover:text-indigo-600 transition"
                >
                  25 Free Websites for Students
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/articles/top-10-github-repositories-every-student-should-know"
                  className="text-slate-600 hover:text-indigo-600 transition"
                >
                  GitHub Repos Masterclass
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/students"
                  className="text-slate-600 hover:text-indigo-600 transition"
                >
                  Visit Student Hub
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 text-slate-900 hover:text-indigo-600 transition"
                >
                  <span>Explore Tech Cafes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : isFreeWebsitesGuide ? (
          <div className="space-y-12">
            <FreeWebsitesEditorialGuide />

            {/* Bottom Back Button & Cross Links */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to SpotPicks Magazine & Guides
              </Link>

              <div className="flex items-center gap-4 text-xs font-bold">
                <Link
                  to="/articles/top-10-github-repositories-every-student-should-know"
                  className="text-slate-600 hover:text-indigo-600 transition"
                >
                  GitHub Repos Masterclass
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/students"
                  className="text-slate-600 hover:text-indigo-600 transition"
                >
                  Visit Student Hub
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 text-slate-900 hover:text-indigo-600 transition"
                >
                  <span>Explore Delhi Tech & Work Cafes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : isGitHubReposGuide ? (
          <div className="space-y-12">
            <GitHubReposEditorialGuide />

            {/* Bottom Back Button & Cross Links */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to SpotPicks Magazine & Guides
              </Link>

              <div className="flex items-center gap-4 text-xs font-bold">
                <Link
                  to="/articles/free-websites-every-college-student-should-know"
                  className="text-slate-600 hover:text-indigo-600 transition"
                >
                  25 Free Websites for Students
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/students"
                  className="text-slate-600 hover:text-indigo-600 transition"
                >
                  Visit Student Hub
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 text-slate-900 hover:text-indigo-600 transition"
                >
                  <span>Explore Delhi Tech & Work Cafes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
            <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
              {article.content.split('\n\n').map((paragraph, pIdx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('# ')) {
                  return null; // Skip redundant H1 since we have it in hero
                }
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2 key={pIdx} className="text-2xl font-black text-slate-900 pt-6 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600 shrink-0" />
                      <span>{trimmed.replace('## ', '')}</span>
                    </h2>
                  );
                }
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="text-lg font-bold text-slate-800 pt-4">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('---')) {
                  return <hr key={pIdx} className="border-slate-100 my-6" />;
                }
                if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
                  const lines = trimmed.split('\n');
                  return (
                    <ul key={pIdx} className="space-y-2 my-4 pl-2">
                      {lines.map((line, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-1" />
                          <span>{line.replace(/^[-*]|\d+\.\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={pIdx} className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Related Topics & Tags:
                </span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Back Button */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Articles
              </Link>

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition"
              >
                Explore Top Delhi Spots
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
