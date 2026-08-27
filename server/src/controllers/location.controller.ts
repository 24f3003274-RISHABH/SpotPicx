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

  public static async getIndiaOverview(req: Request, res: Response): Promise<void> {
    try {
      const overview = await LocationService.getIndiaOverview();
      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_INDIA_OVERVIEW_ERROR',
          message: error.message || 'Failed to fetch India overview',
        },
      });
    }
  }

  public static async getStateBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { stateSlug } = req.params;
      const stateData = await LocationService.getStateBySlug(stateSlug);

      if (!stateData) {
        res.status(404).json({
          success: false,
          error: {
            code: 'STATE_NOT_FOUND',
            message: `State '${stateSlug}' not found`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: stateData,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_STATE_ERROR',
          message: error.message || 'Failed to fetch state data',
        },
      });
    }
  }

  public static async getCityBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { stateSlug, citySlug } = req.params;
      const cityData = await LocationService.getCityBySlug(stateSlug, citySlug);

      if (!cityData) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CITY_NOT_FOUND',
            message: `City '${citySlug}' not found in state '${stateSlug}'`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: cityData,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_CITY_ERROR',
          message: error.message || 'Failed to fetch city data',
        },
      });
    }
  }

  public static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { idOrSlug } = req.params;
      const { status } = req.body;

      if (!['ACTIVE', 'COMING_SOON', 'BETA', 'INACTIVE'].includes(status)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Status must be ACTIVE, COMING_SOON, BETA, or INACTIVE',
          },
        });
        return;
      }

      const updated = await LocationService.updateStatus(idOrSlug, status);
      if (!updated) {
        res.status(404).json({
          success: false,
          error: {
            code: 'LOCATION_NOT_FOUND',
            message: `Location '${idOrSlug}' not found`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Location status updated to ${status}`,
        data: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_STATUS_ERROR',
          message: error.message || 'Failed to update location status',
        },
      });
    }
  }

  public static async joinWaitlist(req: Request, res: Response): Promise<void> {
    try {
      const { citySlug, email, name, role } = req.body;

      if (!citySlug || !email) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'citySlug and email are required',
          },
        });
        return;
      }

      const result = await LocationService.joinWaitlist({ citySlug, email, name, role });
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'WAITLIST_ERROR',
          message: error.message || 'Failed to join waitlist',
        },
      });
    }
  }
}
