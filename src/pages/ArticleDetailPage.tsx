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

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [jsonLd, setJsonLd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
            setJsonLd(res.jsonLd);
          } else {
            setArticle(null);
          }
        }
      } catch (err) {
        console.error('Error fetching article:', err);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      </div>
    </div>
  );
};
