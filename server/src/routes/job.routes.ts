import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// Public routes
router.get('/', JobController.getJobs);
router.get('/:slug', JobController.getJobBySlug);

// Admin / Recruiter
router.post('/', authenticate, authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), JobController.createJob);

export default router;
