import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Search,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Sparkles,
  RefreshCw,
  Save,
  X,
  MapPin,
  Calendar,
  Layers,
  HelpCircle,
  ShieldCheck,
  Tag,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GuidesService } from '../../services/guides.service';
import { Top10Guide, Top10GuideItem, GuideMethodologyType, GuideCategory } from '../../types/guides.types';
import { getGuideFreshness } from '../../utils/guideFreshness';

export const AdminGuidesTab: React.FC = () => {
  const [guides, setGuides] = useState<Top10Guide[]>(() => GuidesService.getAllGuides(true));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFTS' | 'REVIEW_DUE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Edit / Create Modal State
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [currentEditingGuide, setCurrentEditingGuide] = useState<Partial<Top10Guide> | null>(null);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'ITEMS' | 'SEO' | 'FAQ' | 'SOURCES'>('DETAILS');
  const [notification, setNotification] = useState<string | null>(null);

  const refreshGuides = () => {
    setGuides(GuidesService.getAllGuides(true));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const stats = useMemo(() => GuidesService.getStats(), [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.location.toLowerCase().includes(searchQuery.toLowerCase());

      const freshness = getGuideFreshness(guide.lastReviewedDate);

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PUBLISHED' && guide.isPublished) ||
        (statusFilter === 'DRAFTS' && !guide.isPublished) ||
        (statusFilter === 'REVIEW_DUE' && freshness.status === 'REVIEW_DUE');

      const matchesCategory =
        categoryFilter === 'ALL' || guide.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [guides, searchQuery, statusFilter, categoryFilter]);

  // Handlers for quick actions
  const handleTogglePublish = (id: string) => {
    GuidesService.togglePublish(id);
    refreshGuides();
    showNotification('Publication status updated');
  };

  const handleToggleFeature = (id: string) => {
    GuidesService.toggleFeature(id);
    refreshGuides();
    showNotification('Featured status updated');
  };

  const handleMarkReviewed = (id: string) => {
    GuidesService.markAsReviewedToday(id);
    refreshGuides();
    showNotification('Guide marked as reviewed today (90-day reset)');
  };

  const handleDeleteGuide = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete guide: "${title}"?`)) {
      GuidesService.deleteGuide(id);
      refreshGuides();
      showNotification('Guide deleted successfully');
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all guides to original pre-seeded factual datasets? Any custom edits will be reverted.')) {
      GuidesService.resetToDefaults();
      refreshGuides();
      showNotification('All guides reset to default datasets');
    }
  };

  // Modal Open for Edit or Create
  const handleOpenCreateModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentEditingGuide({
      title: '',
      slug: '',
      subtitle: '',
      category: 'Sightseeing & Attractions',
      location: 'Delhi',
      state: 'Delhi NCR',
      country: 'India',
      badgeText: "Editor's Selection",
      methodologyType: "Editor's selection",
      selectionMethodology: 'Curated objectively based on verified factual records, architectural significance, and traveler utility.',
      introduction: '',
      editorialNotes: '',
      publishedDate: today,
      lastReviewedDate: today,
      isPublished: true,
      isFeatured: false,
      author: {
        name: 'SpotPicks Editorial Team',
        role: 'Senior Content Editor',
      },
      seo: {
        metaTitle: '',
        metaDescription: '',
        canonicalUrl: '',
        keywords: ['top 10', 'spotpicks', 'delhi'],
      },
      faq: [
        { question: 'What are the recommended visiting hours?', answer: 'Early morning or late afternoon hours provide the best experience.' },
      ],
      sources: [
        { title: 'SpotPicks Field Audit Records', publisher: 'SpotPicks' },
      ],
      items: [],
    });
    setActiveTab('DETAILS');
    setIsEditingModalOpen(true);
  };

  const handleOpenEditModal = (guide: Top10Guide) => {
    // Deep clone to avoid mutating directly
    setCurrentEditingGuide(JSON.parse(JSON.stringify(guide)));
    setActiveTab('DETAILS');
    setIsEditingModalOpen(true);
  };

  const handleSaveGuide = () => {
    if (!currentEditingGuide || !currentEditingGuide.title) {
      alert('Please provide at least a Guide Title.');
      return;
    }

    if (currentEditingGuide.id) {
      GuidesService.updateGuide(currentEditingGuide.id, currentEditingGuide);
      showNotification('Guide updated successfully');
    } else {
      GuidesService.createGuide(currentEditingGuide);
      showNotification('Guide created successfully');
    }

    setIsEditingModalOpen(false);
    setCurrentEditingGuide(null);
    refreshGuides();
  };

  // Item reordering & editing inside modal
  const handleMoveItem = (index: number, direction: 'UP' | 'DOWN') => {
    if (!currentEditingGuide || !currentEditingGuide.items) return;
    const items = [...currentEditingGuide.items];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    // re-rank
    const reindexed = items.map((it, idx) => ({ ...it, rank: idx + 1 }));
    setCurrentEditingGuide({ ...currentEditingGuide, items: reindexed });
  };

  const handleAddItem = () => {
    if (!currentEditingGuide) return;
    const items = currentEditingGuide.items ? [...currentEditingGuide.items] : [];
    const newRank = items.length + 1;
    const newItem: Top10GuideItem = {
      id: `item-${Date.now()}-${newRank}`,
      rank: newRank,
      name: `New Attraction #${newRank}`,
      category: 'Sightseeing',
      selectionReason: 'Significant historical and architectural importance.',
      factualDescription: 'Factual description of this place.',
      location: currentEditingGuide.location || 'Delhi',
      importantInfo: {
        timings: '9:00 AM – 5:00 PM',
        entryFee: '₹50',
      },
      image: '',
      highlights: [],
    };
    items.push(newItem);
    setCurrentEditingGuide({ ...currentEditingGuide, items });
  };

  const handleRemoveItem = (index: number) => {
    if (!currentEditingGuide || !currentEditingGuide.items) return;
    const items = currentEditingGuide.items.filter((_, i) => i !== index);
    const reindexed = items.map((it, idx) => ({ ...it, rank: idx + 1 }));
    setCurrentEditingGuide({ ...currentEditingGuide, items: reindexed });
  };

  const handleUpdateItemField = (index: number, field: string, value: any) => {
    if (!currentEditingGuide || !currentEditingGuide.items) return;
    const items = [...currentEditingGuide.items];
    items[index] = {
      ...items[index],
      [field]: value,
    };
    setCurrentEditingGuide({ ...currentEditingGuide, items });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              Top 10 Guides Content Engine CMS
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage editorial rankings, transparent methodologies, 90-day freshness reviews, and JSON-LD schema.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
            title="Restore original pre-seeded factual guides"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <Link
            to="/guides"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Directory</span>
          </Link>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Guide</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total Guides</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.total}</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 block uppercase">Published</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">{stats.published}</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600 block uppercase">Featured</span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">{stats.featured}</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-rose-600 block uppercase">Review Due (&gt;90d)</span>
          <span className="text-2xl font-bold text-rose-700 mt-1 block">{stats.reviewDueCount}</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Curated Places</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.totalItems}</span>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total Views</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.totalViews.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guides by title, slug, or location..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Status Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({guides.length})
            </button>
            <button
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'PUBLISHED' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Published ({stats.published})
            </button>
            <button
              onClick={() => setStatusFilter('DRAFTS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'DRAFTS' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Drafts ({stats.drafts})
            </button>
            <button
              onClick={() => setStatusFilter('REVIEW_DUE')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === 'REVIEW_DUE'
                  ? 'bg-rose-700 text-white'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Review Due ({stats.reviewDueCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guides Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Guide Title & Slug</th>
                <th className="px-4 py-3.5">Category & Region</th>
                <th className="px-4 py-3.5">Places</th>
                <th className="px-4 py-3.5">90-Day Freshness</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No guides match the current filters.
                  </td>
                </tr>
              ) : (
                filteredGuides.map(guide => {
                  const freshness = getGuideFreshness(guide.lastReviewedDate);
                  return (
                    <tr key={guide.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-sm max-w-[280px]">
                          {guide.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[280px]">
                          /guides/{guide.slug}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium text-[11px]">
                          {guide.category}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{guide.location}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800">{guide.items?.length || 0}</span>
                        <span className="text-slate-400"> items</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              freshness.status === 'FRESH'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : freshness.status === 'UP_TO_DATE'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {freshness.status === 'FRESH' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Clock className="w-3 h-3 text-rose-600" />
                            )}
                            {freshness.label}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            Reviewed: {guide.lastReviewedDate}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <button
                            onClick={() => handleTogglePublish(guide.id)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                              guide.isPublished
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {guide.isPublished ? 'Published' : 'Draft'}
                          </button>

                          <button
                            onClick={() => handleToggleFeature(guide.id)}
                            className={`text-[10px] font-medium transition-colors ${
                              guide.isFeatured
                                ? 'text-amber-700 font-bold'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {guide.isFeatured ? '★ Featured' : '☆ Not Featured'}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {freshness.status === 'REVIEW_DUE' && (
                            <button
                              onClick={() => handleMarkReviewed(guide.id)}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Mark reviewed today (reset 90-day timer)"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          <Link
                            to={`/guides/${guide.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleOpenEditModal(guide)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Guide & Places"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteGuide(guide.id, guide.title)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Guide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guide Edit / Create Modal */}
      {isEditingModalOpen && currentEditingGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {currentEditingGuide.id ? `Edit Guide: ${currentEditingGuide.title}` : 'Create New Top 10 Guide'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure editorial content, selection rationale, and structured place lists.
                </p>
              </div>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Navigation */}
            <div className="flex border-b border-slate-200 px-6 gap-6 text-xs font-semibold bg-white">
              <button
                onClick={() => setActiveTab('DETAILS')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'DETAILS'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. General Details
              </button>
              <button
                onClick={() => setActiveTab('ITEMS')}
                className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'ITEMS'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>2. Top 10 Places</span>
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px]">
                  {currentEditingGuide.items?.length || 0}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('SEO')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'SEO'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. SEO & Canonical
              </button>
              <button
                onClick={() => setActiveTab('FAQ')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'FAQ'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. FAQs & Schema
              </button>
              <button
                onClick={() => setActiveTab('SOURCES')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'SOURCES'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                5. Sources
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700">
              {/* TAB 1: General Details */}
              {activeTab === 'DETAILS' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-900 block mb-1">Guide Title *</label>
                      <input
                        type="text"
                        value={currentEditingGuide.title || ''}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, title: e.target.value })}
                        placeholder="e.g. Top 10 Places to Visit in Delhi"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-900 block mb-1">URL Slug *</label>
                      <input
                        type="text"
                        value={currentEditingGuide.slug || ''}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, slug: e.target.value })}
                        placeholder="e.g. top-10-places-to-visit-in-delhi"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">Subtitle / Summary</label>
                    <input
                      type="text"
                      value={currentEditingGuide.subtitle || ''}
                      onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, subtitle: e.target.value })}
                      placeholder="e.g. An editorially curated guide to Delhi's supreme historical monuments..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-slate-900 block mb-1">Category</label>
                      <select
                        value={currentEditingGuide.category || 'Sightseeing & Attractions'}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, category: e.target.value as GuideCategory })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="Sightseeing & Attractions">Sightseeing & Attractions</option>
                        <option value="Heritage & History">Heritage & History</option>
                        <option value="Spiritual & Religious">Spiritual & Religious</option>
                        <option value="Cafes & Food">Cafes & Food</option>
                        <option value="Shopping & Markets">Shopping & Markets</option>
                        <option value="Student & Budget Friendly">Student & Budget Friendly</option>
                        <option value="Weekend Getaways">Weekend Getaways</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-900 block mb-1">City / Region</label>
                      <input
                        type="text"
                        value={currentEditingGuide.location || ''}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, location: e.target.value })}
                        placeholder="e.g. Delhi, Dehradun, Jaipur"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-900 block mb-1">State</label>
                      <input
                        type="text"
                        value={currentEditingGuide.state || ''}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, state: e.target.value })}
                        placeholder="e.g. Delhi NCR, Uttarakhand, Rajasthan"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-900 block mb-1">Methodology Type</label>
                      <select
                        value={currentEditingGuide.methodologyType || "Editor's selection"}
                        onChange={e =>
                          setCurrentEditingGuide({
                            ...currentEditingGuide,
                            methodologyType: e.target.value as GuideMethodologyType,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        <option value="Editor's selection">Editor's selection</option>
                        <option value="Popular choices">Popular choices</option>
                        <option value="Recommended places">Recommended places</option>
                        <option value="Historical & cultural significance">Historical & cultural significance</option>
                        <option value="Based on available information">Based on available information</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-900 block mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={currentEditingGuide.badgeText || ''}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, badgeText: e.target.value })}
                        placeholder="e.g. Editor's Selection • UNESCO Sites"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">Selection Methodology Statement</label>
                    <textarea
                      rows={2}
                      value={currentEditingGuide.selectionMethodology || ''}
                      onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, selectionMethodology: e.target.value })}
                      placeholder="Explain transparently why these 10 places were selected without fake claims..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">Editorial Introduction</label>
                    <textarea
                      rows={3}
                      value={currentEditingGuide.introduction || ''}
                      onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, introduction: e.target.value })}
                      placeholder="Write an informative editorial overview..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">Editorial Field Notes (Visitor Advice)</label>
                    <textarea
                      rows={2}
                      value={currentEditingGuide.editorialNotes || ''}
                      onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, editorialNotes: e.target.value })}
                      placeholder="e.g. Always verify holiday timings, carry water..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-900 block mb-1">Hero Image URL</label>
                      <input
                        type="text"
                        value={currentEditingGuide.heroImage || ''}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, heroImage: e.target.value })}
                        placeholder="https://..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-900 block mb-1">Last Reviewed Date (YYYY-MM-DD)</label>
                      <input
                        type="date"
                        value={currentEditingGuide.lastReviewedDate || ''}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, lastReviewedDate: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentEditingGuide.isPublished || false}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, isPublished: e.target.checked })}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="font-semibold text-slate-900">Publish Immediately</span>
                    </label>

                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentEditingGuide.isFeatured || false}
                        onChange={e => setCurrentEditingGuide({ ...currentEditingGuide, isFeatured: e.target.checked })}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="font-semibold text-slate-900">Feature on Homepage / Directory</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: Top 10 Items Builder */}
              {activeTab === 'ITEMS' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Ranked Places ({(currentEditingGuide.items || []).length} / 10)</h4>
                      <p className="text-[11px] text-slate-500">
                        Add, edit and reorder each place. Ensure all 10 have factual descriptions.
                      </p>
                    </div>
                    <button
                      onClick={handleAddItem}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Place</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(currentEditingGuide.items || []).map((item, index) => (
                      <div
                        key={item.id || index}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                              #{index + 1}
                            </span>
                            <input
                              type="text"
                              value={item.name}
                              onChange={e => handleUpdateItemField(index, 'name', e.target.value)}
                              placeholder="Place / Attraction Name"
                              className="font-bold text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs w-64"
                            />
                            <input
                              type="text"
                              value={item.category}
                              onChange={e => handleUpdateItemField(index, 'category', e.target.value)}
                              placeholder="Category Tag"
                              className="text-slate-600 bg-white border border-slate-300 rounded px-2 py-1 text-[11px] w-40"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveItem(index, 'UP')}
                              disabled={index === 0}
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveItem(index, 'DOWN')}
                              disabled={index === (currentEditingGuide.items?.length || 0) - 1}
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="p-1 text-rose-500 hover:text-rose-700"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold text-amber-900 block mb-1">Why It Was Selected</label>
                            <input
                              type="text"
                              value={item.selectionReason}
                              onChange={e => handleUpdateItemField(index, 'selectionReason', e.target.value)}
                              placeholder="e.g. Tallest brick minaret in the world..."
                              className="w-full p-2 bg-white border border-amber-200 rounded text-xs"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-900 block mb-1">Exact Address / Location</label>
                            <input
                              type="text"
                              value={item.location || ''}
                              onChange={e => handleUpdateItemField(index, 'location', e.target.value)}
                              placeholder="e.g. Seth Sarai, Mehrauli, New Delhi"
                              className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-900 block mb-1">Factual Description</label>
                          <textarea
                            rows={2}
                            value={item.factualDescription}
                            onChange={e => handleUpdateItemField(index, 'factualDescription', e.target.value)}
                            placeholder="Provide factual, encyclopedic details..."
                            className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={item.importantInfo?.timings || ''}
                            onChange={e =>
                              handleUpdateItemField(index, 'importantInfo', {
                                ...item.importantInfo,
                                timings: e.target.value,
                              })
                            }
                            placeholder="Timings: e.g. 7 AM - 5 PM"
                            className="p-1.5 bg-white border border-slate-200 rounded text-[11px]"
                          />
                          <input
                            type="text"
                            value={item.importantInfo?.entryFee || ''}
                            onChange={e =>
                              handleUpdateItemField(index, 'importantInfo', {
                                ...item.importantInfo,
                                entryFee: e.target.value,
                              })
                            }
                            placeholder="Entry: e.g. ₹50 (Indians)"
                            className="p-1.5 bg-white border border-slate-200 rounded text-[11px]"
                          />
                          <input
                            type="text"
                            value={item.importantInfo?.nearestMetroOrTransit || ''}
                            onChange={e =>
                              handleUpdateItemField(index, 'importantInfo', {
                                ...item.importantInfo,
                                nearestMetroOrTransit: e.target.value,
                              })
                            }
                            placeholder="Metro: e.g. Qutub Minar (500m)"
                            className="p-1.5 bg-white border border-slate-200 rounded text-[11px]"
                          />
                          <input
                            type="text"
                            value={item.image || ''}
                            onChange={e => handleUpdateItemField(index, 'image', e.target.value)}
                            placeholder="Image URL: https://..."
                            className="p-1.5 bg-white border border-slate-200 rounded text-[11px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SEO & Meta */}
              {activeTab === 'SEO' && (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">SEO Meta Title</label>
                    <input
                      type="text"
                      value={currentEditingGuide.seo?.metaTitle || ''}
                      onChange={e =>
                        setCurrentEditingGuide({
                          ...currentEditingGuide,
                          seo: {
                            metaTitle: e.target.value,
                            metaDescription: currentEditingGuide.seo?.metaDescription || '',
                            canonicalUrl: currentEditingGuide.seo?.canonicalUrl || '',
                            keywords: currentEditingGuide.seo?.keywords || [],
                          },
                        })
                      }
                      placeholder="e.g. Top 10 Places to Visit in Delhi (2026) — Verified Editorial Guide"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">SEO Meta Description</label>
                    <textarea
                      rows={3}
                      value={currentEditingGuide.seo?.metaDescription || ''}
                      onChange={e =>
                        setCurrentEditingGuide({
                          ...currentEditingGuide,
                          seo: {
                            metaTitle: currentEditingGuide.seo?.metaTitle || '',
                            metaDescription: e.target.value,
                            canonicalUrl: currentEditingGuide.seo?.canonicalUrl || '',
                            keywords: currentEditingGuide.seo?.keywords || [],
                          },
                        })
                      }
                      placeholder="Concise 150-160 character description for Google Search results..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={currentEditingGuide.seo?.canonicalUrl || ''}
                      onChange={e =>
                        setCurrentEditingGuide({
                          ...currentEditingGuide,
                          seo: {
                            metaTitle: currentEditingGuide.seo?.metaTitle || '',
                            metaDescription: currentEditingGuide.seo?.metaDescription || '',
                            canonicalUrl: e.target.value,
                            keywords: currentEditingGuide.seo?.keywords || [],
                          },
                        })
                      }
                      placeholder="https://spotpicks.in/guides/top-10-..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-900 block mb-1">SEO Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={(currentEditingGuide.seo?.keywords || []).join(', ')}
                      onChange={e =>
                        setCurrentEditingGuide({
                          ...currentEditingGuide,
                          seo: {
                            metaTitle: currentEditingGuide.seo?.metaTitle || '',
                            metaDescription: currentEditingGuide.seo?.metaDescription || '',
                            canonicalUrl: currentEditingGuide.seo?.canonicalUrl || '',
                            keywords: e.target.value.split(',').map(k => k.trim()),
                          },
                        })
                      }
                      placeholder="places to visit in delhi, top 10 delhi, qutub minar..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: FAQs */}
              {activeTab === 'FAQ' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Frequently Asked Questions (FAQ Schema)</h4>
                      <p className="text-[11px] text-slate-500">
                        Injected directly into the Google FAQPage JSON-LD schema for rich snippets.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const faq = currentEditingGuide.faq ? [...currentEditingGuide.faq] : [];
                        faq.push({ question: 'New Question?', answer: 'Answer text...' });
                        setCurrentEditingGuide({ ...currentEditingGuide, faq });
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(currentEditingGuide.faq || []).map((faqItem, fIdx) => (
                      <div key={fIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={faqItem.question}
                            onChange={e => {
                              const faq = [...(currentEditingGuide.faq || [])];
                              faq[fIdx].question = e.target.value;
                              setCurrentEditingGuide({ ...currentEditingGuide, faq });
                            }}
                            placeholder="Question"
                            className="font-bold text-xs bg-white border border-slate-300 rounded px-2 py-1 w-full mr-2"
                          />
                          <button
                            onClick={() => {
                              const faq = (currentEditingGuide.faq || []).filter((_, i) => i !== fIdx);
                              setCurrentEditingGuide({ ...currentEditingGuide, faq });
                            }}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={faqItem.answer}
                          onChange={e => {
                            const faq = [...(currentEditingGuide.faq || [])];
                            faq[fIdx].answer = e.target.value;
                            setCurrentEditingGuide({ ...currentEditingGuide, faq });
                          }}
                          placeholder="Answer"
                          className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Sources */}
              {activeTab === 'SOURCES' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Verified Citations & Sources</h4>
                      <p className="text-[11px] text-slate-500">
                        Official department registries and archival links to prevent fake facts.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const sources = currentEditingGuide.sources ? [...currentEditingGuide.sources] : [];
                        sources.push({ title: 'Official Source Registry', publisher: 'Department Name' });
                        setCurrentEditingGuide({ ...currentEditingGuide, sources });
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Source</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(currentEditingGuide.sources || []).map((src, sIdx) => (
                      <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                        <input
                          type="text"
                          value={src.title}
                          onChange={e => {
                            const sources = [...(currentEditingGuide.sources || [])];
                            sources[sIdx].title = e.target.value;
                            setCurrentEditingGuide({ ...currentEditingGuide, sources });
                          }}
                          placeholder="Source Title"
                          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          value={src.publisher || ''}
                          onChange={e => {
                            const sources = [...(currentEditingGuide.sources || [])];
                            sources[sIdx].publisher = e.target.value;
                            setCurrentEditingGuide({ ...currentEditingGuide, sources });
                          }}
                          placeholder="Publisher (e.g. ASI)"
                          className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={src.url || ''}
                            onChange={e => {
                              const sources = [...(currentEditingGuide.sources || [])];
                              sources[sIdx].url = e.target.value;
                              setCurrentEditingGuide({ ...currentEditingGuide, sources });
                            }}
                            placeholder="URL: https://..."
                            className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono flex-1"
                          />
                          <button
                            onClick={() => {
                              const sources = (currentEditingGuide.sources || []).filter((_, i) => i !== sIdx);
                              setCurrentEditingGuide({ ...currentEditingGuide, sources });
                            }}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGuide}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Guide</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
