import moment from "moment-timezone"
import { AppDataSource } from "../dbConfig"
import Notification from "../entities/Notification"
import User from "../entities/User"
import sendNotification from "./sendNotification"
import sendEmail from "./emails/sendMail"
import dotenv from 'dotenv'
dotenv.config()


const nodeEnv = process.env.NODE_ENV
const userRepository = AppDataSource.getRepository(User)
const notificationRepository = AppDataSource.getRepository(Notification)

const createNotifications = async(userIds:string[], message:string) => {
    if(nodeEnv === 'TEST') return
    try{
        for(const id of userIds){
            const user = await userRepository.findOne({where:{id}})
            if(!user){
                continue
            }
    
            const newNotification = notificationRepository.create({message, user})
            await notificationRepository.save(newNotification)
    
            sendNotification(id, {...newNotification, createdAt: moment.tz('Africa/Kigali').format("MMM D, [at] h:mm A")})
            sendEmail('notification', user.email, {name:user.fullName, message: newNotification.message})
        }
    }catch(err){
        console.log(err.message)
    }
}

export default createNotifications