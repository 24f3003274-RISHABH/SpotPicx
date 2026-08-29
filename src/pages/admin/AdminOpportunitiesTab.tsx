import React, { useEffect, useState } from 'react';
import {
  Award,
  PlusCircle,
  MapPin,
  Trash2,
  Edit2,
  Clock,
  Globe,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
} from 'lucide-react';
import { opportunityService } from '../../services/opportunity.service';
import { Opportunity, OpportunityType, OpportunityStatus } from '../../types';

export const AdminOpportunitiesTab: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Form State
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    name: '',
    organization: '',
    officialWebsite: '',
    officialApplicationLink: '',
    opportunityType: 'Scholarship',
    eligibility: '',
    whoShouldApply: '',
    shortDescription: '',
    location: 'Global / Remote',
    locationType: 'Remote',
    deadline: null,
    isDeadlineVerified: false,
    status: 'Open',
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: '',
    tags: [],
  });

  const loadOpportunities = async () => {
    try {
      setIsLoading(true);
      const res = await opportunityService.getOpportunities({
        search: searchQuery || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        limit: 100,
      });
      setOpportunities(res.opportunities);
    } catch (e) {
      console.error('Failed to load opportunities:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [searchQuery, statusFilter]);

  const handleOpenCreate = () => {
    setEditingOpp(null);
    setFormData({
      name: '',
      organization: '',
      officialWebsite: '',
      officialApplicationLink: '',
      opportunityType: 'Scholarship',
      eligibility: '',
      whoShouldApply: '',
      shortDescription: '',
      location: 'Global / Remote',
      locationType: 'Remote',
      deadline: null,
      isDeadlineVerified: false,
      status: 'Open',
      isFeatured: false,
      isThisWeek: false,
      stipendOrPrize: '',
      tags: [],
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    setFormData({
      ...opp,
      deadline: opp.deadline ? opp.deadline.split('T')[0] : null,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.organization || !formData.officialWebsite || !formData.officialApplicationLink) {
      setFeedback({ type: 'error', message: 'Please fill in all mandatory fields.' });
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingOpp && (editingOpp._id || editingOpp.id)) {
        const id = editingOpp._id || editingOpp.id!;
        await opportunityService.updateOpportunity(id, formData);
        setFeedback({ type: 'success', message: 'Opportunity updated successfully!' });
      } else {
        await opportunityService.createOpportunity(formData);
        setFeedback({ type: 'success', message: 'Opportunity created successfully!' });
      }
      setIsFormOpen(false);
      loadOpportunities();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Action failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      await opportunityService.deleteOpportunity(id);
      setOpportunities((prev) => prev.filter((o) => (o._id || o.id) !== id));
      setFeedback({ type: 'success', message: 'Opportunity deleted.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to delete opportunity.' });
    }
  };

  const handleCleanupExpired = async () => {
    try {
      const count = await opportunityService.cleanupExpired();
      setFeedback({ type: 'success', message: `Cleaned up ${count} expired opportunities.` });
      loadOpportunities();
    } catch (err) {
      setFeedback({ type: 'error', message: 'Cleanup operation failed.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              Student Opportunities Hub
            </span>
            <span className="text-xs text-slate-400">• Content Governance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Manage Student Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish, edit, and auto-expire verified scholarships, hackathons, and research programs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCleanupExpired}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            title="Purge expired entries"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Cleanup Expired</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-500 hover:text-slate-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search & Status Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Open', 'Upcoming', 'Closed', 'Expired'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Table */}
      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading opportunities...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">No opportunities found</p>
          <p className="text-xs text-slate-400 mt-1">Try changing your filters or add a new opportunity.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Opportunity</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Badges</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {opportunities.map((opp) => (
                  <tr key={opp.id || opp._id || opp.slug} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{opp.name}</div>
                      <div className="text-[11px] text-slate-400">{opp.organization}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                        {opp.opportunityType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          opp.status === 'Open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : opp.status === 'Upcoming'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {opp.isDeadlineVerified && opp.deadline
                        ? new Date(opp.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Unverified / Check Web'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {opp.isFeatured && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold">
                            Featured
                          </span>
                        )}
                        {opp.isThisWeek && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold">
                            This Week
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(opp)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Opportunity"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(opp._id || opp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Opportunity"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingOpp ? 'Edit Opportunity' : 'Add New Student Opportunity'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opportunity Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Google Summer of Code"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization / Provider *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization || ''}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Google Open Source"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opportunity Type *</label>
                  <select
                    value={formData.opportunityType}
                    onChange={(e) =>
                      setFormData({ ...formData, opportunityType: e.target.value as OpportunityType })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium bg-white"
                  >
                    <option value="Scholarship">Scholarship</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Coding Competition">Coding Competition</option>
                    <option value="Research Program">Research Program</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Developer Program">Developer Program</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Student Conference">Student Conference</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as OpportunityStatus })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium bg-white"
                  >
                    <option value="Open">Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                    <option value="Unknown">Unknown</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Website URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.officialWebsite || ''}
                    onChange={(e) => setFormData({ ...formData, officialWebsite: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Application Link *</label>
                  <input
                    type="url"
                    required
                    value={formData.officialApplicationLink || ''}
                    onChange={(e) => setFormData({ ...formData, officialApplicationLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location / Modality</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Global / Remote or Delhi NCR"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Verified Deadline Date (Leave empty if unverified)</label>
                  <input
                    type="date"
                    value={formData.deadline ? String(formData.deadline).split('T')[0] : ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deadline: e.target.value || null,
                        isDeadlineVerified: Boolean(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Eligibility Criteria *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.eligibility || ''}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  placeholder="e.g. Enrolled college student in STEM, minimum 60%..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Audience / Who Should Apply *</label>
                <input
                  type="text"
                  required
                  value={formData.whoShouldApply || ''}
                  onChange={(e) => setFormData({ ...formData, whoShouldApply: e.target.value })}
                  placeholder="e.g. Software engineering and AI students looking for mentors..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief synopsis of the opportunity..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stipend / Prize / Grant (Optional)</label>
                  <input
                    type="text"
                    value={formData.stipendOrPrize || ''}
                    onChange={(e) => setFormData({ ...formData, stipendOrPrize: e.target.value })}
                    placeholder="e.g. ₹2,00,000 grant or $3,000 USD"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden font-medium"
                  />
                </div>
                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured || false}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded-md"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.isThisWeek || false}
                      onChange={(e) => setFormData({ ...formData, isThisWeek: e.target.checked })}
                      className="rounded-md"
                    />
                    <span>This Week</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>{editingOpp ? 'Update Opportunity' : 'Create Opportunity'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
