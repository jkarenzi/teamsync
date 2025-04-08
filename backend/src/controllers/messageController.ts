import Group from '../entities/Group';
import User from '../entities/User';
import { AppDataSource } from '../dbConfig';
import {Request, Response} from 'express'
import Message from '../entities/Message';
import moment from 'moment-timezone';
import sendMessage from '../utils/sendMessage';
import createNotifications from '../utils/createNotifications';


const userRepository = AppDataSource.getRepository(User)
const groupRepository = AppDataSource.getRepository(Group)
const messageRepository = AppDataSource.getRepository(Message)


export class MessageController {
    static async sendMessage(req: Request, res:Response){  
        try{
            const userId = req.user!.id
            const {content, groupId} = req.body

            const user = await userRepository.findOne({ where: { id: userId } })
            const group = await groupRepository.findOne({ where: { id: groupId }, relations:["users"] })

            if (!group) return res.status(404).json({ message: "Group not found" })

            const newMessage = messageRepository.create({
                content,
                sender: user,
                group
            })    

            await messageRepository.save(newMessage)

            const formattedMessage = {
                ...newMessage,
                createdAt: moment(newMessage.createdAt).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
            }

            await sendMessage(group.id, formattedMessage)

            const userIds = group.users.map(user => user.id)
            const filteredIds = userIds.filter(userId => userId !== newMessage.sender.id)
            createNotifications(filteredIds, `New message from ${newMessage.sender.fullName}`)

            return res.status(201).json(formattedMessage)
        }catch(error) {
            console.log(error)
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getGroupMessages(req:Request, res:Response) {
        try{
            const {id} = req.params

            const messages = await messageRepository.find({
                where:{
                    group:{id}
                },
                relations:['sender'],
                order:{createdAt:'ASC'}
            })

            const theMessages = messages.map(message => {
                return {
                    ...message,
                    createdAt: moment(message.createdAt).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
                }
            })

            return res.json(theMessages)
        }catch(error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }
}