import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticate';
import { AssessmentController } from '../controllers/assessmentController';
import { validateCreateSelfAssessment } from '../middleware/validators/assessmentSchema';

const router = Router();

router.use(authenticateToken)

router.post('/', validateCreateSelfAssessment, AssessmentController.submitSelfAssessment)
router.get('/:id/status', AssessmentController.getSelfAssessmentStatus)


export default router;