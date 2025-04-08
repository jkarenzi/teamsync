import { Request, Response } from "express"
import Group from "../entities/Group"
import User from "../entities/User"
import { AppDataSource } from "../dbConfig"
import { In, Not } from "typeorm"
import Assignment from "../entities/Assignment"
import createNotifications from "../utils/createNotifications"
import { addCollaborators, createGithubRepo, deleteRepo, removeCollaborators } from "../utils/githubUtils"

const groupRepository = AppDataSource.getRepository(Group)
const userRepository = AppDataSource.getRepository(User)
const assignmentRepository = AppDataSource.getRepository(Assignment)

class GroupController {
    static async createGroup(req: Request, res: Response) {
        try {
            const { name, userIds, assignmentId } = req.body

            const assignment = await assignmentRepository.findOneBy({id: assignmentId})
            if (!assignment) {
                return res.status(404).json({ message: "Assignment not found" })
            }

            const existingGroup = await groupRepository.findOne({
                where:{
                    name,
                    assignment:{id: assignmentId}
                }
            })
            if(existingGroup){
                return res.status(409).json({message: "Group with this name already exists"})
            }

            const existingGroups = await groupRepository.find({
                where:{
                    assignment:{id: assignmentId}
                },
                relations:["users"]
            })

            for(const group of existingGroups){
                const commonUsers = group.users.filter(user => userIds.includes(user.id))
                const commonUsersString = commonUsers.map(user => user.fullName.split(" ")[0]).join(", ")
                if(commonUsers.length > 0){
                    return res.status(409).json({message: `Some users (${commonUsersString}) are already in another group (${group.name})`})
                }
            }

            const users = await userRepository.findBy({ id: In(userIds) })

            const group = new Group()
            group.name = name
            group.assignment = assignment
            group.users = users

            if(assignment.technical){
                const {repoName, repoLink, error} = await createGithubRepo(`${assignment.name}-${name}`, group.users.map(user => user.githubUsername))
                if(error){
                    return res.status(500).json({message: error})
                }
                
                group.githubRepoName = repoName
                group.githubRepoLink = repoLink
            }

            await groupRepository.save(group)

            createNotifications(userIds, `You were added to a new group (${group.name}), for the ${assignment.name} assignment`)

            return res.status(201).json(group)
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error })
        }
    }

    static async getMembersWithoutGroup(req: Request, res: Response) {
        try{
            const {assignmentId} = req.params
            console.log(assignmentId)
            const assignment = await assignmentRepository.findOne({
                where:{
                    id: assignmentId
                },
                relations:["studentClass", "studentClass.students"]
            })
            if (!assignment) {
                return res.status(404).json({ message: "Assignment not found" })
            }

            const groups = await groupRepository.find({
                where:{
                    assignment:{id: assignmentId}
                },
                relations:["users"]
            })

            console.log(groups)

            const users = []
            for(const student of assignment.studentClass.students){
                const hasGrp = groups.find(group => group.users.find(user => user.id === student.id))
                console.log(`${student.fullName}-${hasGrp}`)
                if(!hasGrp){
                    users.push(student)
                }
            }

            return res.json(users)
        }catch(err){
            return res.status(500).json({ message: "Internal server error", err })
        }
    }

    static async getAllGroups(req: Request, res: Response) {
        const { assignmentId } = req.params
        try {
            const groups = await groupRepository.find({where:{assignment:{id: assignmentId}}, relations: ["users"] })
            return res.status(200).json(groups)
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error })
        }
    }

    static async getOwnGroup(req: Request, res: Response) {
        const { assignmentId } = req.params
        const userId = req.user.id
        try{
            const group = await groupRepository
                .createQueryBuilder("group")
                .leftJoin("group.users", "user")
                .leftJoin("group.assignment", "assignment")
                .where("assignment.id = :assignmentId", { assignmentId })
                .andWhere("user.id = :userId", { userId })
                .getOne()

            if(!group){
                return res.status(404).json({message:'No group found for this assignment'})
            } 
            
            const theGroup = await groupRepository.findOne({
                where:{id: group.id},
                relations:['users','tasks']
            })

            return res.json(theGroup)    
        }catch(err){
            return res.status(500).json({ message: "Internal server error", err })
        }
    }

    static async updateGroup(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { name, userIds } = req.body

            const group = await groupRepository.findOne({
                where:{
                    id: id
                },
                relations: ["users","assignment"] 
            });

            if (!group) {
                return res.status(404).json({ message: "Group not found" })
            }

            const existingGroup = await groupRepository.findOne({
                where:{
                    id: Not(id),
                    name,
                    assignment:{id: group.assignment.id}
                }
            })
            if(existingGroup){
                return res.status(409).json({message: "Group with this name already exists"})
            }

            const existingGroups = await groupRepository.find({
                where:{
                    id: Not(id),
                    assignment:{id: group.assignment.id}
                },
                relations:["users"]
            })

            for(const group of existingGroups){
                const commonUsers = group.users.filter(user => userIds.includes(user.id))
                const commonUsersString = commonUsers.map(user => user.fullName.split(" ")[0]).join(", ")
                if(commonUsers.length > 0){
                    return res.status(409).json({message: `Some users (${commonUsersString}) are already in another group (${group.name})`})
                }
            }

            group.name = name || group.name

            
            if (userIds.length !== 0) {
                const users = await userRepository.findBy({ id: In(userIds) })
                
                if(group.assignment.technical){
                    const usersToAdd = users.filter(user => !group.users.find(u => u.id === user.id))
                    const usersToRemove = group.users.filter(user => !users.find(u => u.id === user.id))

                    console.log(usersToAdd)
                    console.log(usersToRemove)

                    if(usersToAdd.length > 0){
                        const {error} = await addCollaborators(group.githubRepoName, usersToAdd.map(user => user.githubUsername))
                        if(error){
                            return res.status(500).json({message: error})
                        }
                    }

                    if(usersToRemove.length > 0){
                        const {error} = await removeCollaborators(group.githubRepoName, usersToRemove.map(user => user.githubUsername))
                        if(error){
                            return res.status(500).json({message: error})
                        }
                    }
                }

                group.users = users;
            }

            await groupRepository.save(group)

            createNotifications(userIds, `A group that you are part of was updated. (${group.name})`)

            return res.status(200).json(group)
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error })
        }
    }

    static async deleteGroup(req: Request, res: Response) {
        try {
            const { id } = req.params

            const group = await groupRepository.findOne({where:{id:id}, relations:["users"]})
            if (!group) {
                return res.status(404).json({ message: "Group not found" })
            }

            if(group.githubRepoName){
                const {error} = await deleteRepo(group.githubRepoName)
                if(error){
                    return res.status(500).json({message: error})
                }
            }

            await groupRepository.remove(group);

            const userIds = group.users.map(user => user.id)
            createNotifications(userIds, `A group that you are part of was deleted. (${group.name})`)

            return res.status(200).json({ message: "Group deleted successfully" })
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error })
        }
    }

    static async autoAssignGroups(req: Request, res: Response) {
        try {
            const { userIds, groupSize, assignmentId } = req.body

            const assignment = await assignmentRepository.findOneBy({id: assignmentId})
            if (!assignment) {
                return res.status(404).json({ message: "Assignment not found" })
            }

            const users = await userRepository.findBy({ id: In(userIds) })
            if (users.length === 0) {
                return res.status(404).json({ message: "No users found" })
            }

            const shuffledUsers = users.sort(() => Math.random() - 0.5)
            const groups: Group[] = [];

            for (let i = 0; i < shuffledUsers.length; i += groupSize) {
                const groupUsers = shuffledUsers.slice(i, i + groupSize)
                const group = groupRepository.create({ name: `Group ${groups.length + 1}`, users: groupUsers, assignment })
                groups.push(group);
            }

            await groupRepository.save(groups)

            return res.status(201).json(groups)
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error })
        }
    }
}

export default GroupController;