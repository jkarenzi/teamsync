import { Router } from 'express';
import { authenticateToken, checkRole } from '../middleware/authenticate';
import { AssessmentController } from '../controllers/assessmentController';
import { validateCreatePeerAssessment } from '../middleware/validators/assessmentSchema';

const router = Router();

router.use(authenticateToken)

router.post('/', validateCreatePeerAssessment, AssessmentController.submitPeerAssessment)
router.get('/:id/remaining', AssessmentController.getRemainingPeerAssessments)
router.get('/:id', checkRole(['instructor']), AssessmentController.getAssessmentDataByAssignment)


export default router;
