import { AppDataSource } from "../dbConfig"
import { Between } from "typeorm"
import createNotifications from "./createNotifications"
import moment from 'moment-timezone'
import Task from "../entities/Task"
import TaskReminder from "../entities/TaskReminder"


const taskRepository = AppDataSource.getRepository(Task)
const taskReminderRepository = AppDataSource.getRepository(TaskReminder)

export const checkForDueTasks = async() => {
    try{
        console.log('checking for due tasks...')
        const now = new Date();
        const tenHoursLater = new Date(now.getTime() + 10 * 3600 * 1000)

        const tasks = await taskRepository.find({
            where:{
                dueDate: Between(now, tenHoursLater)
            },
            relations:["user"]
        })

        for(const task of tasks){
            const sentReminder = await taskReminderRepository.findOne({
                where:{
                    task:{
                        id: task.id,
                    },
                    status:'sent'
                }
            })

            if(sentReminder){
                continue
            }


            createNotifications([task.user.id], `This is a reminder that your task titled "${task.description}" is due today at ${moment(task.dueDate).tz('Africa/Kigali').format('h:mm A')}`)
            const newReminder = taskReminderRepository.create({task, status:'sent'})
            await taskReminderRepository.save(newReminder)
        }
    }catch(err){
        console.log(err)
    }
}