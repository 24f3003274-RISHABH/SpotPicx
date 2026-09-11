import { Request, Response } from 'express';
import { BricsService } from '../services/brics.service';

export class BricsController {
  public static async getHub(req: Request, res: Response): Promise<void> {
    try {
      const data = await BricsService.getHubPayload();
      res.json({
        success: true,
        data,
      });
    } catch (err: any) {
      console.error('Error in getHub:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch BRICS hub data' });
    }
  }

  public static async getMembers(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as string;
      const data = await BricsService.getMembers(status);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getMemberBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const data = await BricsService.getMemberBySlug(slug);
      if (!data) {
        res.status(404).json({ success: false, error: 'BRICS member country not found' });
        return;
      }
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getSummits(req: Request, res: Response): Promise<void> {
    try {
      const data = await BricsService.getSummits();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getPresidencies(req: Request, res: Response): Promise<void> {
    try {
      const data = await BricsService.getPresidencies();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getFacts(req: Request, res: Response): Promise<void> {
    try {
      const category = req.query.category as string;
      const data = await BricsService.getFacts(category);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getInstitutions(req: Request, res: Response): Promise<void> {
    try {
      const data = await BricsService.getInstitutions();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getFaqs(req: Request, res: Response): Promise<void> {
    try {
      const category = req.query.category as string;
      const data = await BricsService.getFaqs(category);
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getSources(req: Request, res: Response): Promise<void> {
    try {
      const data = await BricsService.getSources();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getAdminStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await BricsService.getAdminStats();
      res.json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async upsertFact(req: Request, res: Response): Promise<void> {
    try {
      const updated = await BricsService.upsertFact(req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async upsertFaq(req: Request, res: Response): Promise<void> {
    try {
      const updated = await BricsService.upsertFaq(req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async seedCollections(req: Request, res: Response): Promise<void> {
    try {
      const result = await BricsService.seedBricsCollections();
      res.json({ success: true, message: 'BRICS collections seeded successfully', data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
