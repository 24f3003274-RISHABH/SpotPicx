import mongoose from 'mongoose';
import { Report, IReport, ReportTargetType, ReportReason, ReportStatus } from '../models/Report';
import { dbConnection } from '../config/db';

export interface CreateReportInput {
  targetType: ReportTargetType;
  targetId: string;
  targetName?: string;
  reason: ReportReason;
  details: string;
  reporterEmail?: string;
}

export interface InMemoryReport {
  _id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetName: string;
  reason: ReportReason;
  details: string;
  reporter?: {
    _id: string;
    name: string;
    email: string;
  };
  reporterEmail?: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const inMemoryReports: InMemoryReport[] = [];

export class ReportService {
  public static async createReport(
    reporterId: string | undefined,
    userDoc: { name?: string; email?: string } | undefined,
    input: CreateReportInput
  ) {
    if (!input.details || input.details.trim().length < 5) {
      throw new Error('Please provide specific details regarding this issue');
    }

    if (dbConnection.getStatus().isConnected) {
      try {
        const report = new Report({
          targetType: input.targetType,
          targetId: input.targetId,
          targetName: input.targetName || '',
          reason: input.reason,
          details: input.details.trim(),
          reporter: reporterId ? new mongoose.Types.ObjectId(reporterId) : undefined,
          reporterEmail: input.reporterEmail || userDoc?.email,
          status: 'PENDING',
        });

        await report.save();
        return report;
      } catch (e) {
        console.warn('[ReportService] DB createReport error', e);
      }
    }

    const newReport: InMemoryReport = {
      _id: `rep-${Date.now()}`,
      targetType: input.targetType,
      targetId: input.targetId,
      targetName: input.targetName || 'Reported Content',
      reason: input.reason,
      details: input.details.trim(),
      reporter: reporterId
        ? { _id: reporterId, name: userDoc?.name || 'User', email: userDoc?.email || '' }
        : undefined,
      reporterEmail: input.reporterEmail || userDoc?.email,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryReports.unshift(newReport);
    return newReport;
  }

  public static async getReports(params: { status?: ReportStatus; page?: number; limit?: number } = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 20));

    if (dbConnection.getStatus().isConnected) {
      try {
        const filter: Record<string, any> = {};
        if (params.status) filter.status = params.status;

        const total = await Report.countDocuments(filter);
        const reports = await Report.find(filter)
          .populate('reporter', 'name email role')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        return { reports, total, page, totalPages: Math.ceil(total / limit) };
      } catch (e) {
        console.warn('[ReportService] DB getReports error', e);
      }
    }

    let list = inMemoryReports;
    if (params.status) list = list.filter((r) => r.status === params.status);

    const total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return { reports: paginated, total, page, totalPages: Math.ceil(total / limit) || 1 };
  }

  public static async updateReportStatus(
    reportId: string,
    status: ReportStatus,
    adminNotes?: string
  ) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const rep = await Report.findByIdAndUpdate(
          reportId,
          { status, adminNotes, resolvedAt: new Date() },
          { new: true }
        );
        return rep;
      } catch (e) {
        console.warn('[ReportService] DB updateReportStatus error', e);
      }
    }

    const rep = inMemoryReports.find((r) => r._id === reportId);
    if (!rep) throw new Error('Report not found');

    rep.status = status;
    if (adminNotes) rep.adminNotes = adminNotes;
    rep.updatedAt = new Date();
    return rep;
  }
}
