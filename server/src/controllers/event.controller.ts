import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/statusCodes';

export class EventController {
  /**
   * GET /api/v1/events
   */
  public static getEvents = asyncHandler(async (req: Request, res: Response) => {
    const { category, timeframe, price, locality, query, tag, status, limit, page } = req.query;

    const result = await EventService.getEvents({
      category: category as string,
      timeframe: timeframe as any,
      price: price as any,
      locality: locality as string,
      query: query as string,
      tag: tag as string,
      status: status as string,
      limit: limit ? parseInt(limit as string, 10) : 20,
      page: page ? parseInt(page as string, 10) : 1,
    });

    return sendSuccess(res, result, 'Events retrieved successfully');
  });

  /**
   * GET /api/v1/events/:slug
   */
  public static getEventBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const event = await EventService.getEventBySlug(slug);

    if (!event) {
      return sendError(res, 'Event not found', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, { event }, 'Event details retrieved');
  });

  /**
   * POST /api/v1/events (Admin)
   */
  public static createEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await EventService.createEvent(req.body);
    return sendSuccess(res, { event }, 'Event created successfully', HTTP_STATUS.CREATED);
  });

  /**
   * DELETE /api/v1/events/:id (Admin)
   */
  public static deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await EventService.deleteEvent(id);
    return sendSuccess(res, null, 'Event deleted successfully');
  });
}
