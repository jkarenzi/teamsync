import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import assignmentRoutes from './assignmentRoutes'
import groupRoutes from "./groupRoutes";
import taskRoutes from "./taskRoutes";
import messageRoutes from "./messageRoutes";
import peerAssessmentRoutes from './assessmentRoutes'
import selfAssessmentRoutes from './selfAssessmentRoutes'
import reportRoutes from './reportRoutes'
import classRoutes from './studentClassRoutes'
import notificationRoutes from "./notificationRoutes";


const router = Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/assignments', assignmentRoutes)
router.use('/groups', groupRoutes)
router.use('/tasks', taskRoutes)
router.use('/messages', messageRoutes)
router.use('/peerAssessments', peerAssessmentRoutes)
router.use('/selfAssessments', selfAssessmentRoutes)
router.use('/reports', reportRoutes)
router.use('/classes', classRoutes)
router.use('/notifications', notificationRoutes)


export default router