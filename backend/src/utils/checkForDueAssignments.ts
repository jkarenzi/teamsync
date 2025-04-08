import { AppDataSource } from "../dbConfig"
import Assignment from "../entities/Assignment"
import { Between } from "typeorm"
import createNotifications from "./createNotifications"
import moment from 'moment-timezone'
import AssignmentReminder from "../entities/AssignmentReminder"
import Notification from "../entities/Notification"
import User from "../entities/User"
import sendNotification from "./sendNotification"
import sendEmail from "./emails/sendMail"


const assignmentRepository = AppDataSource.getRepository(Assignment)
const assignmentReminderRepository = AppDataSource.getRepository(AssignmentReminder)
const userRepository = AppDataSource.getRepository(User)
const notificationRepository = AppDataSource.getRepository(Notification)


export const checkForDueAssignments = async() => {
    try{
        console.log('checking for due assignments...')
        const now = new Date();
        const tenHoursLater = new Date(now.getTime() + 10 * 3600 * 1000)

        const assignments = await assignmentRepository.find({
            where:{
                dueDate: Between(now, tenHoursLater)
            },
            relations:["studentClass","studentClass.students"]
        })

        for(const assignment of assignments){
            const userIds = assignment.studentClass.students.map(student => student.id)
            for(const id of userIds){
                const theUser = await userRepository.findOne({where:{id}})
                if(!theUser){
                    continue
                }

                const sentReminder = await assignmentReminderRepository.findOne({
                    where:{
                        status:'sent',
                        assignment:{
                            id: assignment.id
                        },
                        user:{
                            id: theUser.id
                        }
                    }
                })
    
                if(sentReminder){
                    continue
                }


        
                const newNotification = notificationRepository.create({
                    message: `This is a reminder that your assignment titled ${assignment.name} is due today at ${moment(assignment.dueDate).tz('Africa/Kigali').format('h:mm A')}`,
                    user: theUser
                })
                await notificationRepository.save(newNotification)
        
                sendNotification(id, {...newNotification, createdAt: moment.tz('Africa/Kigali').format("MMM D, [at] h:mm A")})
                sendEmail('notification', theUser.email, {name:theUser.fullName, message: newNotification.message})

                const newReminder = assignmentReminderRepository.create({assignment, user: theUser, status:'sent'})
                await assignmentReminderRepository.save(newReminder)
            }
        }
    }catch(err){
        console.log(err)
    }
}