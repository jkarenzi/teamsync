import { Request, Response } from 'express';
import { AppDataSource } from '../dbConfig';
import StudentClass from '../entities/StudentClass';
import { In } from 'typeorm';
import User from '../entities/User';
import createNotifications from '../utils/createNotifications';
import Group from '../entities/Group';


const classRepository = AppDataSource.getRepository(StudentClass);
const userRepository = AppDataSource.getRepository(User)
const groupRepository = AppDataSource.getRepository(Group)

export class StudentClassController {
    static async createClass(req: Request, res: Response) {
        try {
            const { name, description, userIds } = req.body

            if(!name || !description || userIds.length === 0){
                return res.status(400).json({message: 'Validation error'})
            }
            
            const existingClass = await classRepository.findOne({ where: { name } })
            if (existingClass) {
                return res.status(400).json({ message: 'Class with this name already exists' })
            }

            const users = await userRepository.findBy({ id: In(userIds) })
            
            const newClass = classRepository.create({ name, description, students: users })
            await classRepository.save(newClass)

            createNotifications(userIds, `You were added to a new class. (${newClass.name} class)`)
            
            return res.status(201).json(newClass)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal Server Error', error })
        }
    }

    static async updateClass(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { name, description, userIds } = req.body

            const studentClass = await classRepository.findOne({ where: { id: id } })
            if (!studentClass) {
                return res.status(404).json({ message: 'Class not found' })
            }

            studentClass.name = name || studentClass.name
            studentClass.description = description || studentClass.description

            if (userIds.length !== 0) {
                const users = await userRepository.findBy({ id: In(userIds) })
                studentClass.students = users;
            }
            
            await classRepository.save(studentClass)

            userIds.length !== 0 && createNotifications(userIds, `A class that you are part of was updated. (${studentClass.name} class)`)
            
            return res.json(studentClass)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal Server Error', error })
        }
    }

    static async deleteClass(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const studentClass = await classRepository.findOne({ where: { id: id }, relations:["students","assignments"] })
            
            if (!studentClass) {
                return res.status(404).json({ message: 'Class not found' })
            }

            const assignmentIds = studentClass.assignments.map(assignment => assignment.id)
            for(const assignmentId of assignmentIds){
                const groups = await groupRepository.find({
                    where:{assignment:{id:assignmentId}}
                })

                for(const group of groups){
                    group.users = []
                    await groupRepository.save(group)
                }
            }
            
            await classRepository.remove(studentClass)

            const userIds = studentClass.students.map(student => student.id)

            createNotifications(userIds, `A class that you are part of was deleted. (${studentClass.name} class)`)
            return res.json({ message: 'Class deleted successfully' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal Server Error', error })
        }
    }

    static async getClasses(req: Request, res: Response) {
        try {
            const classes = await classRepository.find({
                relations:["students"],
                order:{
                    createdAt:'DESC'
                }
            })
                     
            return res.json(classes)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Internal Server Error', error })
        }
    }
}