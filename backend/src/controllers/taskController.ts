import { Request, Response } from "express";
import { AppDataSource } from "../dbConfig";
import Task from "../entities/Task";
import User from "../entities/User";
import Group from "../entities/Group";
import createNotifications from "../utils/createNotifications";


const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);
const groupRepository = AppDataSource.getRepository(Group);

export class TaskController {
    static async createTask(req: Request, res: Response) {
        try {
            const { description, status, priorityLevel, groupId, userId, dueDate } = req.body

            const user = await userRepository.findOne({ where: { id: userId } })
            const group = await groupRepository.findOne({ where: { id: groupId }, relations:["users"] })

            if (!group) return res.status(404).json({ message: "Group not found" })

            const task = taskRepository.create({ description, status, priorityLevel, user, group, dueDate })
            await taskRepository.save(task)

            const userIds = group.users.map(user => user.id)
            const filteredIds = userIds.filter(id => id !== req.user!.id)

            createNotifications(filteredIds, `A new task titled "${task.description}" was created and assigned to ${task.user.fullName}`)

            return res.status(201).json(task)
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getTasksByGroup(req: Request, res: Response) {
        try {
            const { groupId } = req.params;
            const tasks = await taskRepository.find({
                where: { group: { id: groupId } },
                relations: ["user", "group"],
                order:{
                    dueDate:'DESC'
                }
            });

            return res.status(200).json(tasks)
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getTasksByUser(req: Request, res: Response) {
        try {
            const userId = req.user.id
            const tasks = await taskRepository.find({
                where: { user: { id: userId } },
                relations: ["user", "group"]
            });

            return res.status(200).json(tasks)
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async updateTask(req: Request, res: Response) {
        const theUserId = req.user!.id
        try {
            const { id } = req.params
            const { description, status, priorityLevel, userId, dueDate } = req.body

            let task = await taskRepository.findOne({ where: { id }, relations:['user','group','group.users'] })
            if (!task) return res.status(404).json({ message: "Task not found" })

            const userIds = task.group.users.map(user => user.id)
            const filteredIds = userIds.filter(id => id !== theUserId)

            task.description = description || task.description
            task.status = status || task.status
            task.priorityLevel = priorityLevel || task.priorityLevel
            task.dueDate = dueDate || task.dueDate

            if(userId){
                const user = await userRepository.findOne({ where: { id: userId } })
                task.user = user || task.user
            }

            await taskRepository.save(task)

            createNotifications(filteredIds, `A task titled "${task.description}" was updated by ${task.user.fullName}`)

            return res.status(200).json(task)
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async deleteTask(req: Request, res: Response) {
        const userId = req.user.id
        try {
            const { id } = req.params
            const task = await taskRepository.findOne({ where: { id:id, user:{id: userId} }, relations: ["user", "group","group.users"] })

            if (!task) return res.status(404).json({ message: "Task not found" })

            await taskRepository.remove(task)

            const userIds = task.group.users.map(user => user.id)
            const filteredIds = userIds.filter(id => id !== userId)
            createNotifications(filteredIds, `A task titled "${task.description}" was deleted by ${task.user.fullName}`)

            return res.status(200).json({ message: "Task deleted successfully" })
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }
}