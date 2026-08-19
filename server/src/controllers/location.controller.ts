import { Request, Response } from 'express';
import { LocationService } from '../services/location.service';
import { BusinessService } from '../services/business.service';

export class LocationController {
  public static async getLocations(req: Request, res: Response): Promise<void> {
    try {
      const { type, city } = req.query;
      const locations = await LocationService.getAllLocations({
        type: type ? String(type) : undefined,
        city: city ? String(city) : undefined,
      });

      res.status(200).json({
        success: true,
        count: locations.length,
        data: locations,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_LOCATIONS_ERROR',
          message: error.message || 'Failed to fetch locations',
        },
      });
    }
  }

  public static async getLocationBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const location = await LocationService.getLocationBySlug(slug);

      if (!location) {
        res.status(404).json({
          success: false,
          error: {
            code: 'LOCATION_NOT_FOUND',
            message: `Location '${slug}' not found`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: location,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_LOCATION_ERROR',
          message: error.message || 'Failed to fetch location',
        },
      });
    }
  }

  public static async getLocationBusinesses(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const location = await LocationService.getLocationBySlug(slug);

      if (!location) {
        res.status(404).json({
          success: false,
          error: {
            code: 'LOCATION_NOT_FOUND',
            message: `Location '${slug}' not found`,
          },
        });
        return;
      }

      // Query businesses for this locality or city
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50);

      const businessesResult = await BusinessService.getBusinesses({
        locality: location.type === 'LOCALITY' ? location.name : undefined,
        city: location.type === 'CITY' ? location.name : undefined,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        location,
        ...businessesResult,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_LOCATION_BUSINESSES_ERROR',
          message: error.message || 'Failed to fetch location businesses',
        },
      });
    }
  }
}
