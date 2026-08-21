import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { USER_ROLES } from '../constants/roles';

const router = Router();

// Public / Semi-auth: Anyone can submit a report
router.post('/', (req, res, next) => {
  // Optional auth
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, ReportController.createReport);

// Protected: Admins can view reports
router.get(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ReportController.getReports
);

// Protected: Admins can update status
router.patch(
  '/:id/status',
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ReportController.updateReportStatus
);

export default router;
