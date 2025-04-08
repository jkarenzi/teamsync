import { StudentClassController } from "../controllers/classController";
import { Router } from "express";
import { authenticateToken } from "../middleware/authenticate";


const router = Router();
router.use(authenticateToken)


router.route('/').get(StudentClassController.getClasses).post(StudentClassController.createClass)
router.route('/:id').patch(StudentClassController.updateClass).delete(StudentClassController.deleteClass)

export default router