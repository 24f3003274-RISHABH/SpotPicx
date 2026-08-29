import { Top10Guide, Top10GuideItem } from '../types/guides.types';
import { allInitialGuides } from '../data/guides';
import { getGuideFreshness } from '../utils/guideFreshness';

const STORAGE_KEY = 'spotpicks_top10_guides_v1';

export class GuidesService {
  private static loadGuidesFromStorage(): Top10Guide[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load guides from localStorage', e);
    }
    return [...allInitialGuides];
  }

  private static saveGuidesToStorage(guides: Top10Guide[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
    } catch (e) {
      console.error('Failed to save guides to localStorage', e);
    }
  }

  public static getAllGuides(includeUnpublished: boolean = true): Top10Guide[] {
    const guides = this.loadGuidesFromStorage();
    if (!includeUnpublished) {
      return guides.filter(g => g.isPublished);
    }
    return guides;
  }

  public static getGuideBySlug(slug: string): Top10Guide | undefined {
    const guides = this.loadGuidesFromStorage();
    return guides.find(g => g.slug === slug || g.id === slug);
  }

  public static createGuide(guideData: Partial<Top10Guide>): Top10Guide {
    const guides = this.loadGuidesFromStorage();
    const now = new Date().toISOString().split('T')[0];
    
    const newSlug = guideData.slug || 
      (guideData.title ? guideData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `guide-${Date.now()}`);

    const newGuide: Top10Guide = {
      id: guideData.id || `guide-${Date.now()}`,
      slug: newSlug,
      title: guideData.title || 'Untitled Top 10 Guide',
      subtitle: guideData.subtitle || 'Editorially curated guide to verified local highlights.',
      category: guideData.category || 'Sightseeing & Attractions',
      location: guideData.location || 'Delhi',
      state: guideData.state || 'Delhi NCR',
      country: guideData.country || 'India',
      heroImage: guideData.heroImage || 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80',
      badgeText: guideData.badgeText || "Editor's Selection",
      methodologyType: guideData.methodologyType || "Editor's selection",
      selectionMethodology: guideData.selectionMethodology || 'Curated objectively based on verified factual records, architectural significance, and traveler utility.',
      introduction: guideData.introduction || 'This guide provides verified factual details for the top recommended places.',
      editorialNotes: guideData.editorialNotes || 'Always verify operating hours during national holidays.',
      publishedDate: guideData.publishedDate || now,
      lastReviewedDate: guideData.lastReviewedDate || now,
      isPublished: guideData.isPublished !== undefined ? guideData.isPublished : false,
      isFeatured: guideData.isFeatured || false,
      viewCount: guideData.viewCount || 0,
      author: guideData.author || {
        name: 'SpotPicks Editorial Team',
        role: 'Senior Content Editor',
      },
      seo: {
        metaTitle: guideData.seo?.metaTitle || `${guideData.title || 'Top 10 Guide'} — SpotPicks`,
        metaDescription: guideData.seo?.metaDescription || `Discover the verified top 10 places in ${guideData.location || 'India'} with SpotPicks factual editorial guide.`,
        canonicalUrl: guideData.seo?.canonicalUrl || `https://spotpicks.in/guides/${newSlug}`,
        keywords: guideData.seo?.keywords || ['top 10', 'spotpicks guide', guideData.location || 'delhi'],
      },
      faq: guideData.faq || [
        {
          question: `What is the best time to visit places in this guide?`,
          answer: `Most destinations are best visited during pleasant morning hours or between October and March.`,
        },
      ],
      sources: guideData.sources || [
        { title: 'SpotPicks Editorial Knowledge Base', publisher: 'SpotPicks' },
      ],
      relatedGuideSlugs: guideData.relatedGuideSlugs || [],
      items: guideData.items || [],
    };

    guides.unshift(newGuide);
    this.saveGuidesToStorage(guides);
    return newGuide;
  }

  public static updateGuide(id: string, updates: Partial<Top10Guide>): Top10Guide | null {
    const guides = this.loadGuidesFromStorage();
    const index = guides.findIndex(g => g.id === id || g.slug === id);
    if (index === -1) return null;

    const current = guides[index];
    const updated: Top10Guide = {
      ...current,
      ...updates,
      id: current.id, // Preserve original ID
      seo: {
        ...current.seo,
        ...(updates.seo || {}),
      },
      author: {
        ...current.author,
        ...(updates.author || {}),
      },
    };

    // Ensure item ranks are sequential
    if (updated.items) {
      updated.items = updated.items.map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));
    }

    guides[index] = updated;
    this.saveGuidesToStorage(guides);
    return updated;
  }

  public static deleteGuide(id: string): boolean {
    const guides = this.loadGuidesFromStorage();
    const filtered = guides.filter(g => g.id !== id && g.slug !== id);
    if (filtered.length !== guides.length) {
      this.saveGuidesToStorage(filtered);
      return true;
    }
    return false;
  }

  public static markAsReviewedToday(id: string): Top10Guide | null {
    const today = new Date().toISOString().split('T')[0];
    return this.updateGuide(id, { lastReviewedDate: today });
  }

  public static togglePublish(id: string): Top10Guide | null {
    const guide = this.getGuideBySlug(id);
    if (!guide) return null;
    return this.updateGuide(id, { isPublished: !guide.isPublished });
  }

  public static toggleFeature(id: string): Top10Guide | null {
    const guide = this.getGuideBySlug(id);
    if (!guide) return null;
    return this.updateGuide(id, { isFeatured: !guide.isFeatured });
  }

  public static reorderItems(guideId: string, items: Top10GuideItem[]): Top10Guide | null {
    const reindexed = items.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
    return this.updateGuide(guideId, { items: reindexed });
  }

  public static incrementViewCount(slug: string): void {
    const guides = this.loadGuidesFromStorage();
    const guide = guides.find(g => g.slug === slug || g.id === slug);
    if (guide) {
      guide.viewCount = (guide.viewCount || 0) + 1;
      this.saveGuidesToStorage(guides);
    }
  }

  public static resetToDefaults(): Top10Guide[] {
    this.saveGuidesToStorage(allInitialGuides);
    return [...allInitialGuides];
  }

  public static getStats() {
    const guides = this.loadGuidesFromStorage();
    const total = guides.length;
    const published = guides.filter(g => g.isPublished).length;
    const featured = guides.filter(g => g.isFeatured).length;
    
    let reviewDueCount = 0;
    let totalItems = 0;
    let totalViews = 0;

    guides.forEach(g => {
      totalItems += g.items?.length || 0;
      totalViews += g.viewCount || 0;
      const freshness = getGuideFreshness(g.lastReviewedDate);
      if (freshness.status === 'REVIEW_DUE') {
        reviewDueCount++;
      }
    });

    return {
      total,
      published,
      drafts: total - published,
      featured,
      reviewDueCount,
      totalItems,
      totalViews,
    };
  }
}
