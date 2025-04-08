import User from "../entities/User";
import { AppDataSource } from "../dbConfig";
import Group from "../entities/Group";
import Task from "../entities/Task";
import PeerAssessment from "../entities/PeerAssessment";
import SelfAssessment from "../entities/SelfAssessment";
import {Request, Response} from 'express'
import Message from "../entities/Message";
import Session from "../entities/Session";
import { Between, In } from "typeorm";
import { getGithubContributionStats } from "../utils/githubUtils";


const userRepository = AppDataSource.getRepository(User)
const groupRepository = AppDataSource.getRepository(Group)
const taskRepository = AppDataSource.getRepository(Task);
const peerAssessmentRepository = AppDataSource.getRepository(PeerAssessment)
const selfAssessmentRepository = AppDataSource.getRepository(SelfAssessment)
const messageRepository = AppDataSource.getRepository(Message)
const sessionRepository = AppDataSource.getRepository(Session)


export class ReportController {
    static async getContributionReport(req:Request,res:Response) {
        try{
            const groupId = req.params.id
            const group = await groupRepository.findOne({where:{id: groupId}, relations:["users","assignment"]})    
            if(!group) return res.status(404).json({message:'Group not found'})

            const userIds = group.users.map(user => user.id);    

            const tasksPerUser = await taskRepository
                .createQueryBuilder("task")
                .select("user.id", "userId")
                .addSelect("user.fullName", "fullName")
                .addSelect("COUNT(task.id)", "assignedTasks")
                .innerJoin("task.user", "user")
                .andWhere("task.groupId = :groupId", { groupId })
                .groupBy("user.id, user.fullName")
                .getRawMany();

            const tasks = await taskRepository.find({
                where: { group: { id: groupId } },
                relations: ["user"],
                select:{
                    id:true,
                    description:true,
                    status:true,
                    priorityLevel: true,
                    dueDate: true,
                    user:{
                        id: true
                    }
                }
            });

            const peerAssessmentsByGroup = await peerAssessmentRepository.find({
                where:{group:{id: groupId}},
                relations: ["giver","receiver"],
                select:{
                    id: true,
                    score:true,
                    feedback: true,
                    giver:{
                        id: true
                    },
                    receiver:{
                        id: true
                    }
                }
            })

            const selfAssessments = await selfAssessmentRepository.find({
                where:{group:{id: groupId}},
                relations:["user"],
                select:{
                    id: true,
                    score:true,
                    feedback: true,
                    user: {
                        id: true
                    }
                }
            })

            const messagesPerUser = await messageRepository
                .createQueryBuilder("message")
                .select("sender.id", "senderId")
                .addSelect("sender.fullName", "fullName")
                .addSelect("COUNT(message.id)", "totalMessages")
                .innerJoin("message.sender", "sender")
                .andWhere("message.groupId = :groupId", { groupId })
                .groupBy("sender.id, sender.fullName")
                .getRawMany();

            const sessions = await sessionRepository.find({
                where: {
                    user: { id: In(userIds) },
                    loginAt: Between(group.assignment.createdAt, group.assignment.dueDate),
                },
                relations:["user"]
            });

            const userSessionTimes: {[key:string]:any} = {}
            sessions.forEach(session => {
                const userId = session.user.id;
                const logoutTime = session.logoutAt ? session.logoutAt.getTime() : Date.now();
                const duration = parseFloat(((logoutTime - session.loginAt.getTime()) / (1000 * 60 * 60)).toFixed(2));
        
                if (!userSessionTimes[userId]) {
                    userSessionTimes[userId] = duration;
                }else{
                    userSessionTimes[userId] += duration;
                }
            });

            let githubData:any = []
            if(group.assignment.technical){
                githubData = await getGithubContributionStats(group, group.githubRepoName)
            }

            console.log(githubData)
            

            const result = userIds.map(userId => {
                const dataObj:{[key:string]:any} = {}
                dataObj.userId = userId,
                dataObj.fullName = group.users.find(user => user.id === userId)?.fullName,
                dataObj.assignedTasks = tasksPerUser.find(userData => userData.userId === userId)?.assignedTasks || 0,
                dataObj.tasks = tasks.filter(task => task.user.id === userId),
                dataObj.selfAssessment = selfAssessments.find(assessment => assessment.user.id === userId) || null,
                dataObj.peerAssessments = peerAssessmentsByGroup.filter(assessment => assessment.receiver.id === userId),
                dataObj.totalMessages = (messagesPerUser.find(user => user.senderId === userId))?.totalMessages || 0,
                dataObj.totalHoursLoggedIn = userSessionTimes[userId] || 0

                if(group.assignment.technical){
                    dataObj.totalCommits = githubData.find(contributor => contributor.username === group.users.find(user => user.id === userId)?.githubUsername)?.totalCommits || 0
                }
                return dataObj
            })

            return res.json(result)    
        }catch(err) {
            console.log(err)
            return res.status(500).json({message:"Internal Server Error"})
        }
    }
}