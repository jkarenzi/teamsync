import {changePassword, changeUserRole, changeUserStatus, editProfile, getAllUsers, getOwnProfile} from "../controllers/userController";
import { Router } from "express";
import { authenticateToken, checkRole } from "../middleware/authenticate";
import { validateUserRoleSchema, validateUserStatusSchema } from "../middleware/validators/userSchema";
import { validateChangePassword, validateEditProfile } from "../middleware/validators/authSchema";


const userRouter = Router()

userRouter.use(authenticateToken)

userRouter.get('/', getAllUsers)
userRouter.get('/own', getOwnProfile)
userRouter.patch('/status/:id', checkRole(['instructor']), validateUserStatusSchema, changeUserStatus)
userRouter.patch('/role/:id', checkRole(['instructor']), validateUserRoleSchema, changeUserRole)
userRouter.post('/change_password', validateChangePassword, changePassword)
userRouter.patch('/', validateEditProfile, editProfile)


export default userRouter