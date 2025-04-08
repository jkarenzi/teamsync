import {signUp, login, authenticatePusher, logout} from '../controllers/userController'
import { NextFunction, Router, urlencoded } from "express";
import { validateLogin, validateSignup } from "../middleware/validators/authSchema";
import { authenticateToken } from '../middleware/authenticate';


const authRouter = Router()


authRouter.post('/signup', validateSignup, signUp)
authRouter.post('/login', validateLogin, login)
authRouter.post('/logout', authenticateToken, logout)
authRouter.post('/pusher', authenticateToken, urlencoded({ extended: false }), authenticatePusher)


export default authRouter