import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';

export const getHealth = (req: Request, res: Response) => {
  const healthData = HealthService.getHealth();
  
  // Directly adheres to Phase 1 required response signature:
  // { success: true, message: "SpotPicks API is running" }
  return res.status(200).json({
    success: true,
    message: 'SpotPicx API is running',
    data: healthData,
  });
};
