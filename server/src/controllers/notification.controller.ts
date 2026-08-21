import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  // GET /api/v1/notifications
  public static async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const result = await NotificationService.getUserNotifications(user._id?.toString() || user.id);

      res.status(200).json({
        success: true,
        data: result.notifications,
        unreadCount: result.unreadCount,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch notifications',
      });
    }
  }

  // PATCH /api/v1/notifications/:id/read
  public static async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const result = await NotificationService.markAsRead(id, user._id?.toString() || user.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update notification',
      });
    }
  }

  // POST /api/v1/notifications/read-all
  public static async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      const result = await NotificationService.markAllAsRead(user._id?.toString() || user.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update notifications',
      });
    }
  }
}
