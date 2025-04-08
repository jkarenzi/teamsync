import { AppDataSource } from '../dbConfig'
import Notification from '../entities/Notification'
import {Request, Response} from 'express'
import moment from 'moment-timezone'


const notificationRepository = AppDataSource.getRepository(Notification)

export default class NotificationController {
    static async getNotifications(req:Request, res:Response) {
        const userId = req.user!.id

        try{
            const notifications = await notificationRepository.find({
                where:{
                    user:{id: userId}
                },
                order: {
                    createdAt: "DESC",
                },
            })

            const allNotifications = notifications.map(notification => ({
                ...notification,
                createdAt: moment(notification.createdAt).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
            }))

            return res.json(allNotifications)
        }catch(err){
            return res.status(500).json({message: 'Internal Server Error'})
        }
    }

    static async markNotificationAsRead(req:Request, res:Response) {
        const userId = req.user!.id
        const notificationId = req.params.id

        try{
            const notification = await notificationRepository.findOne({
                where:{
                    id: notificationId,
                    user:{id: userId}
                }
            })

            if(!notification){
                return res.status(404).json({status:'error', message:'Notification not found'})
            }

            notification.read = true
            await notificationRepository.save(notification)


            return res.json({
                ...notification,
                createdAt: moment(notification.createdAt).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
            })
        }catch(err){
            return res.status(500).json({message: 'Internal Server Error'})
        }
    }

    static async markAllNotificationAsRead(req:Request, res:Response) {
        const userId = req.user!.id

        try{
            
            await notificationRepository.update(
                {read: false},
                {read: true}
            )

            const notifications = await notificationRepository.find({
                where:{
                    user:{id: userId}
                },
                order: {
                    createdAt: "DESC",
                },
            })

            const allNotifications = notifications.map(notification => ({
                ...notification,
                createdAt: moment(notification.createdAt).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
            }))

            return res.json(allNotifications)
        }catch(err){
            return res.status(500).json({message: 'Internal Server Error'})
        }
    }
}