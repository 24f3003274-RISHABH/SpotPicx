import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/statusCodes';

export class JobController {
  /**
   * GET /api/v1/jobs
   */
  public static getJobs = asyncHandler(async (req: Request, res: Response) => {
    const { type, skill, location, query, tag, status, limit, page } = req.query;

    const result = await JobService.getJobs({
      type: type as any,
      skill: skill as string,
      location: location as string,
      query: query as string,
      tag: tag as string,
      status: status as string,
      limit: limit ? parseInt(limit as string, 10) : 20,
      page: page ? parseInt(page as string, 10) : 1,
    });

    return sendSuccess(res, result, 'Jobs and internships retrieved successfully');
  });

  /**
   * GET /api/v1/jobs/:slug
   */
  public static getJobBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const job = await JobService.getJobBySlug(slug);

    if (!job) {
      return sendError(res, 'Job opportunity not found', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, { job }, 'Job details retrieved');
  });

  /**
   * POST /api/v1/jobs (Admin / Recruiter)
   */
  public static createJob = asyncHandler(async (req: Request, res: Response) => {
    const job = await JobService.createJob(req.body);
    return sendSuccess(res, { job }, 'Job listing posted successfully', HTTP_STATUS.CREATED);
  });
}
