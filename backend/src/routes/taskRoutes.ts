import { Router } from "express";
import { validateTaskCreation, validateTaskUpdate } from "../middleware/validators/taskSchema";
import { authenticateToken, checkRole } from "../middleware/authenticate";
import { TaskController } from "../controllers/taskController";


const taskRouter = Router();
taskRouter.use(authenticateToken);

taskRouter.post("/", validateTaskCreation, TaskController.createTask);
taskRouter.get("/group/:groupId", TaskController.getTasksByGroup);
taskRouter.get("/user", checkRole(['user']), TaskController.getTasksByUser);
taskRouter.patch("/:id", validateTaskUpdate, TaskController.updateTask);
taskRouter.delete("/:id", TaskController.deleteTask);


export default taskRouter;