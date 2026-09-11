import React, { useEffect, useState } from 'react';
import {
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Save,
  X,
  Search,
  ExternalLink,
  Landmark,
  Building2,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { bricsApi } from '../../api/bricsApi';
import { BricsFact, BricsFaq, BricsMember } from '../../types/brics.types';

export const AdminBricsTab: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [facts, setFacts] = useState<BricsFact[]>([]);
  const [faqs, setFaqs] = useState<BricsFaq[]>([]);
  const [members, setMembers] = useState<BricsMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active sub-tab in Admin
  const [subTab, setSubTab] = useState<'facts' | 'faqs' | 'members'>('facts');

  // Fact Edit state
  const [editingFact, setEditingFact] = useState<BricsFact | null>(null);

  // FAQ Edit state
  const [editingFaq, setEditingFaq] = useState<BricsFaq | null>(null);

  // Filter state
  const [faqSearch, setFaqSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, factsRes, faqsRes, membersRes] = await Promise.all([
        bricsApi.getAdminStats(),
        bricsApi.getFacts(),
        bricsApi.getFaqs(),
        bricsApi.getMembers(),
      ]);
      setStats(statsRes);
      setFacts(factsRes);
      setFaqs(faqsRes);
      setMembers(membersRes);
    } catch (err: any) {
      console.error('Failed to load BRICS admin data:', err);
      setMessage({ type: 'error', text: 'Failed to load BRICS database records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncDatabase = async () => {
    try {
      setSyncing(true);
      setMessage(null);
      const res = await bricsApi.seedCollections();
      setMessage({
        type: 'success',
        text: 'Successfully synced & upserted all BRICS entities into MongoDB Atlas without data loss.',
      });
      await loadData();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: `Sync error: ${err.message || 'Could not complete database sync'}`,
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFact) return;
    try {
      await bricsApi.upsertFact(editingFact);
      setMessage({ type: 'success', text: `Fact "${editingFact.label}" saved successfully.` });
      setEditingFact(null);
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: `Failed to save fact: ${err.message}` });
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    try {
      await bricsApi.upsertFaq(editingFaq);
      setMessage({ type: 'success', text: `FAQ saved successfully.` });
      setEditingFaq(null);
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: `Failed to save FAQ: ${err.message}` });
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      !faqSearch.trim() ||
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-700">
              <Globe className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              BRICS 2026 India Knowledge Hub Management
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Control center for BRICS member nations, factual data cards, rotating summits, and verified FAQ entities stored in MongoDB Atlas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncDatabase}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing Atlas...' : 'Seed / Sync Atlas'}</span>
          </button>
        </div>
      </div>

      {/* Alert / Notification message */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Database & Collection Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Database Engine</span>
          <span className="text-lg font-bold text-indigo-700 block mt-1">
            {stats?.databaseReady ? 'MongoDB Atlas' : 'In-Memory Fallback'}
          </span>
          <span className="text-[10px] text-slate-400">
            {stats?.databaseReady ? 'Persistent Active' : 'Fallback Active'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Full Members</span>
          <span className="text-2xl font-bold text-slate-900 block mt-1">
            {stats?.counts?.members || 11}
          </span>
          <span className="text-[10px] text-slate-400">11 Nations + 10 Partners</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Summits Indexed</span>
          <span className="text-2xl font-bold text-slate-900 block mt-1">
            {stats?.counts?.summits || 18}
          </span>
          <span className="text-[10px] text-slate-400">2009 Yekaterinburg – 2026 Delhi</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Verified Facts</span>
          <span className="text-2xl font-bold text-amber-600 block mt-1">
            {stats?.counts?.facts || facts.length}
          </span>
          <span className="text-[10px] text-slate-400">Data Metric Cards</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">FAQ Entities</span>
          <span className="text-2xl font-bold text-emerald-600 block mt-1">
            {stats?.counts?.faqs || faqs.length}
          </span>
          <span className="text-[10px] text-slate-400">Structured Schema</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Institutions</span>
          <span className="text-2xl font-bold text-slate-900 block mt-1">
            {stats?.counts?.institutions || 5}
          </span>
          <span className="text-[10px] text-slate-400">NDB, CRA, Councils</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('facts')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            subTab === 'facts' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Fact Cards ({facts.length})
        </button>
        <button
          onClick={() => setSubTab('faqs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            subTab === 'faqs' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          FAQ Entities ({faqs.length})
        </button>
        <button
          onClick={() => setSubTab('members')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            subTab === 'members' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Member States ({members.length})
        </button>
      </div>

      {/* SUBTAB 1: FACTS MANAGEMENT */}
      {subTab === 'facts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Manage metric cards displayed on the public BRICS Knowledge Hub.
            </span>
            <button
              onClick={() =>
                setEditingFact({
                  key: `fact_${Date.now()}`,
                  label: '',
                  value: '',
                  description: '',
                  category: 'economy',
                  sourceName: 'Official Communiqué',
                  sourceUrl: 'https://www.brics2026.gov.in',
                  verifiedAt: new Date().toISOString().split('T')[0],
                  displayOrder: facts.length + 1,
                  featured: true,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Fact</span>
            </button>
          </div>

          {/* Fact Edit Modal/Card */}
          {editingFact && (
            <form
              onSubmit={handleSaveFact}
              className="p-5 rounded-2xl bg-amber-50/60 border border-amber-300 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">
                  {editingFact._id ? 'Edit Fact Card' : 'Create New Fact Card'}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingFact(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fact Key</label>
                  <input
                    type="text"
                    value={editingFact.key}
                    onChange={(e) => setEditingFact({ ...editingFact, key: e.target.value })}
                    required
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Label</label>
                  <input
                    type="text"
                    value={editingFact.label}
                    onChange={(e) => setEditingFact({ ...editingFact, label: e.target.value })}
                    required
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Headline Value</label>
                  <input
                    type="text"
                    value={editingFact.value}
                    onChange={(e) => setEditingFact({ ...editingFact, value: e.target.value })}
                    required
                    placeholder="e.g. 36.7% or $100 Billion"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingFact.description}
                  onChange={(e) => setEditingFact({ ...editingFact, description: e.target.value })}
                  required
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingFact.category}
                    onChange={(e) => setEditingFact({ ...editingFact, category: e.target.value as any })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="economy">Economy</option>
                    <option value="governance">Governance</option>
                    <option value="institutions">Institutions</option>
                    <option value="summit_2026">Summit 2026</option>
                    <option value="membership">Membership</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source Name</label>
                  <input
                    type="text"
                    value={editingFact.sourceName}
                    onChange={(e) => setEditingFact({ ...editingFact, sourceName: e.target.value })}
                    required
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source URL</label>
                  <input
                    type="url"
                    value={editingFact.sourceUrl}
                    onChange={(e) => setEditingFact({ ...editingFact, sourceUrl: e.target.value })}
                    required
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFact(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Fact</span>
                </button>
              </div>
            </form>
          )}

          {/* Facts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Label & Key</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Source</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facts.map((fact) => (
                  <tr key={fact.key} className="hover:bg-slate-50">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{fact.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{fact.key}</span>
                    </td>
                    <td className="p-3 font-bold text-amber-700 font-mono text-sm">{fact.value}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
                        {fact.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 truncate max-w-[150px]">{fact.sourceName}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setEditingFact(fact)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded-md hover:bg-indigo-50 inline-flex items-center gap-1 font-bold"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FAQS MANAGEMENT */}
      {subTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <button
              onClick={() =>
                setEditingFaq({
                  slug: `faq_${Date.now()}`,
                  question: '',
                  answer: '',
                  category: 'General',
                  displayOrder: faqs.length + 1,
                  sourceName: 'Official MEA Communiqué',
                  sourceUrl: 'https://www.brics2026.gov.in',
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New FAQ</span>
            </button>
          </div>

          {/* FAQ Edit Form */}
          {editingFaq && (
            <form
              onSubmit={handleSaveFaq}
              className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">
                  {editingFaq._id ? 'Edit FAQ Entity' : 'Create New FAQ Entity'}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingFaq.slug}
                    onChange={(e) => setEditingFaq({ ...editingFaq, slug: e.target.value })}
                    required
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingFaq.category}
                    onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                    required
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">Question</label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  required
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 block mb-1">Answer</label>
                <textarea
                  rows={3}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  required
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save FAQ</span>
                </button>
              </div>
            </form>
          )}

          {/* FAQs List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.slug}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                      {faq.category}
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">{faq.slug}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{faq.question}</h4>
                  <p className="text-slate-600 leading-relaxed line-clamp-2">{faq.answer}</p>
                </div>

                <button
                  onClick={() => setEditingFaq(faq)}
                  className="p-2 text-indigo-600 hover:text-indigo-800 rounded-md hover:bg-indigo-50 shrink-0 inline-flex items-center gap-1 font-bold text-xs"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: MEMBER STATES */}
      {subTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div
              key={m.slug}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{m.flagEmoji}</span>
                  <div>
                    <span className="font-bold text-slate-900 block">{m.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{m.capital}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[10px]">
                  {m.joinedYear}
                </span>
              </div>
              <p className="text-slate-600 line-clamp-2 leading-relaxed">{m.bricsRole}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
