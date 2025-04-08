import { Router } from 'express'
import GroupController from '../controllers/groupController'
import { validateCreateGroup, validateUpdateGroup, validateAutoAssignGroups } from '../middleware/validators/groupSchema'
import { authenticateToken, checkRole } from '../middleware/authenticate';

const groupRouter = Router();

groupRouter.use(authenticateToken)

groupRouter.post('/', validateCreateGroup, checkRole(['instructor']), GroupController.createGroup);
groupRouter.get('/:assignmentId/own', GroupController.getOwnGroup)
groupRouter.get('/:assignmentId/nogrps', GroupController.getMembersWithoutGroup)
groupRouter.get('/:assignmentId', GroupController.getAllGroups)
groupRouter.patch('/:id', checkRole(['instructor']), validateUpdateGroup, GroupController.updateGroup);
groupRouter.delete('/:id', checkRole(['instructor']), GroupController.deleteGroup);
groupRouter.post('/auto-assign', checkRole(['instructor']), validateAutoAssignGroups,GroupController.autoAssignGroups)

export default groupRouter;