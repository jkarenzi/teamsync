import { Router } from "express";
import { AssignmentController } from "../controllers/assignmentController";
import { authenticateToken } from "../middleware/authenticate";
import { checkRole } from "../middleware/authenticate";
import { validateCreateAssignment, validateUpdateAssignment } from "../middleware/validators/assignmentSchema";

const router = Router();

router.post("/",authenticateToken, checkRole(['instructor']), validateCreateAssignment, AssignmentController.createAssignment);
router.get("/", authenticateToken, AssignmentController.getAllAssignments);
router.get("/instructor", authenticateToken, AssignmentController.getInstructorAssignments);
router.get('/own', authenticateToken, AssignmentController.getOwnAssignments)
router.get("/:id", authenticateToken, AssignmentController.getAssignmentById);
router.patch("/:id", authenticateToken, checkRole(['instructor']), validateUpdateAssignment, AssignmentController.updateAssignment);
router.delete("/:id", authenticateToken, checkRole(['instructor']), AssignmentController.deleteAssignment);


export default router;