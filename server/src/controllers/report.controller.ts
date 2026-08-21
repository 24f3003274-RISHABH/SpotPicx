import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';

export class ReportController {
  // POST /api/v1/reports
  public static async createReport(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { targetType, targetId, targetName, reason, details, reporterEmail } = req.body;

      if (!targetType || !targetId || !reason || !details) {
        res.status(400).json({
          success: false,
          message: 'targetType, targetId, reason, and details are required',
        });
        return;
      }

      const report = await ReportService.createReport(
        user?._id?.toString() || user?.id,
        user ? { name: user.name, email: user.email } : undefined,
        {
          targetType,
          targetId,
          targetName,
          reason,
          details,
          reporterEmail,
        }
      );

      res.status(201).json({
        success: true,
        message: 'Report submitted. Our moderation team will review this within 24 hours.',
        data: report,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit report',
      });
    }
  }

  // GET /api/v1/reports (Admin only)
  public static async getReports(req: Request, res: Response): Promise<void> {
    try {
      const { status, page, limit } = req.query;

      const result = await ReportService.getReports({
        status: status as any,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      res.status(200).json({
        success: true,
        data: result.reports,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch reports',
      });
    }
  }

  // PATCH /api/v1/reports/:id/status (Admin only)
  public static async updateReportStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const updated = await ReportService.updateReportStatus(id, status, adminNotes);

      res.status(200).json({
        success: true,
        message: 'Report status updated',
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update report status',
      });
    }
  }
}
