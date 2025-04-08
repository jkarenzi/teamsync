import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticate';
import { ReportController } from '../controllers/reportController';

const router = Router();

router.use(authenticateToken)

router.get('/:id', ReportController.getContributionReport)

export default router;
