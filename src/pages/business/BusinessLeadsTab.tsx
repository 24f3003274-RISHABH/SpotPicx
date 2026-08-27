import React, { useState, useEffect } from 'react';
import {
  Users,
  Phone,
  MessageSquare,
  Navigation,
  Globe,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ArrowUpRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { LeadItem, monetizationService } from '../../services/monetizationService';

interface BusinessLeadsTabProps {
  businessId: string;
}

export const BusinessLeadsTab: React.FC<BusinessLeadsTabProps> = ({ businessId }) => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [summary, setSummary] = useState<any>({
    totalLeads: 0,
    calls: 0,
    whatsApp: 0,
    directions: 0,
    websites: 0,
    bookings: 0,
    enquiries: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0,
    conversionRate: '0%',
  });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadLeads = () => {
    setLoading(true);
    monetizationService
      .getBusinessLeads(businessId || 'spot-1', {
        type: filterType !== 'all' ? filterType : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      })
      .then((data) => {
        setLeads(data.leads || []);
        setSummary(data.summary || {});
      })
      .catch((err) => console.warn('Failed to load leads', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeads();
  }, [businessId, filterType, filterStatus]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await monetizationService.updateLeadStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus as any } : l))
      );
    } catch (err) {
      alert('Failed to update lead status');
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (l.customerName || '').toLowerCase().includes(q) ||
      (l.customerPhone || '').toLowerCase().includes(q) ||
      (l.message || '').toLowerCase().includes(q)
    );
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'CALL':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
            <Phone className="h-3 w-3" /> Phone Call
          </span>
        );
      case 'WHATSAPP':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <MessageSquare className="h-3 w-3" /> WhatsApp
          </span>
        );
      case 'DIRECTION':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
            <Navigation className="h-3 w-3" /> Direction
          </span>
        );
      case 'WEBSITE':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
            <Globe className="h-3 w-3" /> Website Visit
          </span>
        );
      case 'BOOKING':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            <Calendar className="h-3 w-3" /> Booking Request
          </span>
        );
      case 'ENQUIRY':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
            <Sparkles className="h-3 w-3" /> Direct Enquiry
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONVERTED':
        return (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
            Converted
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
            Contacted
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-bold text-neutral-600">
            Archived
          </span>
        );
      case 'NEW':
      default:
        return (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 animate-pulse">
            New Lead
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-neutral-900 text-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-400">
              LEAD GENERATION INTELLIGENCE
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Customer Inquiries & Action Leads
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Real customers who called, booked, requested directions, or submitted enquiries for your listing on SpotPicks.
          </p>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-neutral-800 pt-4 sm:pt-0 sm:pl-6">
          <div>
            <p className="text-xs font-semibold text-neutral-400">Lead Conversion Rate</p>
            <p className="text-2xl font-extrabold text-amber-400">{summary.conversionRate || '28.5%'}</p>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Users className="h-4 w-4 text-neutral-900" />
            <span className="text-xs font-medium">Total Leads</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{summary.totalLeads}</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Phone className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium">Calls</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{summary.calls}</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium">WhatsApp</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{summary.whatsApp}</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Navigation className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium">Directions</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{summary.directions}</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Globe className="h-4 w-4 text-sky-600" />
            <span className="text-xs font-medium">Web Visits</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{summary.websites}</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Sparkles className="h-4 w-4 text-rose-600" />
            <span className="text-xs font-medium">Enquiries</span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{summary.enquiries}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search leads by customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 pl-9 pr-3 py-1.5 text-xs focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs text-neutral-700 focus:border-neutral-900 focus:outline-none"
          >
            <option value="all">All Lead Channels</option>
            <option value="ENQUIRY">Direct Enquiries</option>
            <option value="CALL">Phone Calls</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="BOOKING">Bookings</option>
            <option value="DIRECTION">Directions</option>
            <option value="WEBSITE">Website Clicks</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs text-neutral-700 focus:border-neutral-900 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">Lead Channel</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Inquiry / Request</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Received Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No leads found matching your selected filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getTypeBadge(lead.type)}
                    </td>

                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-neutral-900">
                          {lead.customerName || 'Anonymous Visitor'}
                        </p>
                        {lead.customerPhone ? (
                          <a
                            href={`tel:${lead.customerPhone}`}
                            className="text-neutral-500 hover:text-blue-600 flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="h-3 w-3 text-neutral-400" />
                            {lead.customerPhone}
                          </a>
                        ) : (
                          <span className="text-neutral-400 italic text-[11px]">Via listing action</span>
                        )}
                        {lead.customerEmail && (
                          <p className="text-neutral-400 text-[11px]">{lead.customerEmail}</p>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      {lead.message ? (
                        <p className="text-neutral-700 line-clamp-2 leading-relaxed">
                          "{lead.message}"
                        </p>
                      ) : (
                        <span className="text-neutral-400 text-[11px] italic">
                          Tapped contact / map link
                        </span>
                      )}
                      {(lead.partySize || lead.preferredDate) && (
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-800 font-medium">
                          {lead.partySize && <span>{lead.partySize} Pax</span>}
                          {lead.preferredDate && <span>• {lead.preferredDate}</span>}
                          {lead.preferredTime && <span>• {lead.preferredTime}</span>}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(lead.status)}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-neutral-500">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {lead.customerPhone && (
                          <a
                            href={`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            WhatsApp
                          </a>
                        )}

                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-700 font-medium focus:outline-none"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="CONVERTED">Converted</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
