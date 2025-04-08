import { Request, Response } from "express"
import { AppDataSource } from "../dbConfig"
import Assignment from "../entities/Assignment"
import User from "../entities/User"
import moment from 'moment-timezone'
import StudentClass from "../entities/StudentClass"
import createNotifications from "../utils/createNotifications"
import Group from "../entities/Group"


const assignmentRepository = AppDataSource.getRepository(Assignment)
const userRepository = AppDataSource.getRepository(User)
const classRepository = AppDataSource.getRepository(StudentClass);
const groupRepository = AppDataSource.getRepository(Group)

export class AssignmentController {
    static async createAssignment(req: Request, res: Response) {
        try {
            const { name, description, dueDate, classId, technical } = req.body
            const instructorId = req.user.id

            const studentClass = await classRepository.findOne({
                where:{
                    id: classId
                },
                relations:["students"]
            })

            if(!studentClass){
                return res.status(404).json({message: 'Class not found'})
            }

            const instructor = await userRepository.findOne({ where: { id: instructorId } })

            const assignment = assignmentRepository.create({ name, description, dueDate, instructor, studentClass, technical })
            await assignmentRepository.save(assignment)

            const userIds = studentClass.students.map(student => student.id)
            createNotifications(userIds, `A new assignment titled "${assignment.name}" was created for your class.`)

            return res.status(201).json({
                ...assignment,
                dueDate: moment(assignment.dueDate).tz('Africa/Kigali').format(),
                dueDateFormatted: moment(assignment.dueDate).tz('Africa/Kigali').format("MMM D, [at] h:mm A"),
            })
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getAllAssignments(req: Request, res: Response) {
        try {
            const assignments = await assignmentRepository.find({ relations: ["instructor","studentClass"] })
            const theAssignments = assignments.map(assignment => {
                return {
                    ...assignment,
                    dueDate: moment(assignment.dueDate).tz('Africa/Kigali').format(),
                    dueDateFormatted: moment(assignment.dueDate).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
                }
            })

            return res.status(200).json(theAssignments)
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getOwnAssignments(req: Request, res: Response) {
        try{
            const userId = req.user!.id
            const assignments = await assignmentRepository
                .createQueryBuilder("assignment")
                .leftJoinAndSelect("assignment.studentClass", "studentClass")
                .innerJoin("studentClass.students", "student")
                .where("student.id = :userId", { userId })
                .orderBy("assignment.dueDate", "DESC")
                .getMany();

            const theAssignments = assignments.map(assignment => {
                return {
                    ...assignment,
                    dueDate: moment(assignment.dueDate).tz('Africa/Kigali').format(),
                    dueDateFormatted: moment(assignment.dueDate).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
                }
            })

            return res.status(200).json(theAssignments)
        }catch(error){
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getAssignmentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const assignment = await assignmentRepository.findOne({ where: { id }, relations: ["instructor","studentClass","studentClass.students"] })

            if (!assignment) return res.status(404).json({ message: "Assignment not found" })

            return res.status(200).json({
                ...assignment,
                dueDate: moment(assignment.dueDate).tz('Africa/Kigali').format(),
                dueDateFormatted: moment(assignment.dueDate).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getInstructorAssignments(req: Request, res: Response) {
        try {
            const instructorId = req.user.id;
            const assignments = await assignmentRepository.find({
                where: { 
                    instructor: { 
                        id: instructorId 
                    } 
                },
                relations: ["instructor","studentClass"],
                order:{
                    dueDate:'DESC'
                }
            })

            const theAssignments = assignments.map(assignment => {
                return {
                    ...assignment,
                    dueDate: moment(assignment.dueDate).tz('Africa/Kigali').format(),
                    dueDateFormatted: moment(assignment.dueDate).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
                }
            })

            return res.status(200).json(theAssignments)
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error });
        }
    }

    static async updateAssignment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, dueDate, classId } = req.body;

            const assignment = await assignmentRepository.findOne({ where: { id }, relations:["studentClass","studentClass.students"] })
            if (!assignment) return res.status(404).json({ message: "Assignment not found" })

            const userIds = assignment.studentClass.students.map(student => student.id)

            assignment.name = name || assignment.name
            assignment.description = description || assignment.description
            assignment.dueDate = dueDate || assignment.dueDate

            if(classId){
                const studentClass = await classRepository.findOne({where:{id: classId}})
                assignment.studentClass = studentClass || assignment.studentClass
            }

            await assignmentRepository.save(assignment)

            createNotifications(userIds, `Your assignment titled "${assignment.name}" was updated`)

            return res.status(200).json({
                ...assignment,
                dueDate: moment(assignment.dueDate).tz('Africa/Kigali').format(),
                dueDateFormatted: moment(assignment.dueDate).tz('Africa/Kigali').format("MMM D, [at] h:mm A")
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async deleteAssignment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const instructorId = req.user.id

            const assignment = await assignmentRepository.findOne({ where: { id, instructor:{id: instructorId} }, relations:["studentClass","studentClass.students"] })

            if (!assignment) return res.status(404).json({ message: "Assignment not found" })

            const groups = await groupRepository.find({
                where:{assignment:{id:id}}
            })

            for(const group of groups){
                group.users = []
                await groupRepository.save(group)
            }    

            await assignmentRepository.remove(assignment)

            const userIds = assignment.studentClass.students.map(student => student.id)
            createNotifications(userIds, `Your assignment titled "${assignment.name}" was deleted`)

            return res.status(200).json({ message: "Assignment deleted successfully" })
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }
}
