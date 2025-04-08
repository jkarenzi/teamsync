import { Router } from 'express';
import { validateSendMessageSchema } from '../middleware/validators/messageSchema';
import { MessageController } from '../controllers/messageController';
import { authenticateToken } from '../middleware/authenticate';

const router = Router();

router.use(authenticateToken)

router.post('/', validateSendMessageSchema, MessageController.sendMessage)
router.get('/:id', MessageController.getGroupMessages)

export default router;
