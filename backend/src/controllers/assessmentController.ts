import Group from '../entities/Group';
import User from '../entities/User';
import { AppDataSource } from '../dbConfig';
import PeerAssessment from '../entities/PeerAssessment';
import {Request, Response} from 'express'
import SelfAssessment from '../entities/SelfAssessment';
import Assignment from '../entities/Assignment';


const peerAssessmentRepository = AppDataSource.getRepository(PeerAssessment)
const selfAssessmentRepository = AppDataSource.getRepository(SelfAssessment)
const userRepository = AppDataSource.getRepository(User)
const groupRepository = AppDataSource.getRepository(Group)
const assignmentRepository = AppDataSource.getRepository(Assignment)

export class AssessmentController {
    static async submitPeerAssessment(req:Request, res:Response) {
        try {
            const userId = req.user.id
            const { receiverId, groupId, involvement, completion, collaboration, leadership, overallContribution, feedback } = req.body;

            const existingAssessment = await peerAssessmentRepository.findOne({
                where:{
                    giver:{id: userId},
                    receiver:{id: receiverId},
                    group:{id: groupId}
                }
            })

            if(existingAssessment) return res.status(409).json({message:'Peer Assessment already exists'})

            const receiver = await userRepository.findOne({where:{id: receiverId}})
            if(!receiver) return res.status(404).json({message:'Receiver not found'})

            const group = await groupRepository.findOne({where:{id: groupId}, relations:["users"]})    
            if(!group) return res.status(404).json({message:'Group not found'})

            const giver = await userRepository.findOne({where:{id: userId}})

            const score = involvement + completion + collaboration + leadership + overallContribution

            const newAssessment = peerAssessmentRepository.create({
                group,
                giver,
                receiver,
                score,
                feedback
            })

            await peerAssessmentRepository.save(newAssessment)

            const peerAssessments =  await peerAssessmentRepository.find({
                where:{
                    group:{id: groupId},
                    giver:{id: userId}
                },
                relations: ["receiver"]
            })

            const unAssessedUsers:{id:string, name:string}[] = []
            for(const user of group.users){
                const existingAssessment = peerAssessments.find(assessment => assessment.receiver.id === user.id)
                if(!existingAssessment){
                    unAssessedUsers.push({
                        id: user.id,
                        name: user.fullName
                    })
                }
            }

            return res.json({message:'Peer assessment submitted successfully', totalPeerAssessments: peerAssessments.length, unAssessedUsers})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getRemainingPeerAssessments(req:Request, res:Response) {
        try{
            const userId = req.user.id
            const groupId = req.params.id
            const group = await groupRepository.findOne({where:{id: groupId}, relations:["users"]})    
            if(!group) return res.status(404).json({message:'Group not found'})

            const peerAssessments =  await peerAssessmentRepository.find({
                where:{
                    group:{id: groupId},
                    giver:{id: userId}
                },
                relations: ["receiver"]
            })

            const unAssessedUsers:{id:string, name:string}[] = []
            for(const user of group.users){
                const existingAssessment = peerAssessments.find(assessment => assessment.receiver.id === user.id)
                if(!existingAssessment){
                    unAssessedUsers.push({
                        id: user.id,
                        name: user.fullName
                    })
                }
            }

            return res.json({totalPeerAssessments: peerAssessments.length, unAssessedUsers})
        }catch(error){
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async submitSelfAssessment(req:Request, res:Response) {
        try {
            const userId = req.user.id
            const { groupId, involvement, completion, collaboration, leadership, overallContribution, feedback } = req.body;

            const existingAssessment = await selfAssessmentRepository.findOne({
                where:{
                    user:{id: userId},
                    group:{id: groupId}
                }
            })

            if(existingAssessment) return res.status(409).json({message:'Self Assessment already completed'})

            const user = await userRepository.findOne({where:{id: userId}})
            const group = await groupRepository.findOne({where:{id: groupId}})    
            if(!group) return res.status(404).json({message:'Group not found'})

            const score = involvement + completion + collaboration + leadership + overallContribution

            const newAssessment = selfAssessmentRepository.create({
                group,
                user,
                score,
                feedback
            })

            await selfAssessmentRepository.save(newAssessment)

            return res.status(201).json({message:'Self assessment submitted successfully'})
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getSelfAssessmentStatus(req:Request, res:Response) {
        try{
            const userId = req.user.id
            const groupId = req.params.id
            const group = await groupRepository.findOne({where:{id: groupId}, relations:["users"]})    
            if(!group) return res.status(404).json({message:'Group not found'})

            const existingAssessment = await selfAssessmentRepository.findOne({
                where:{
                    user:{id: userId},
                    group:{id: groupId}
                }
            })

            if(existingAssessment){
                return res.json({status: true})
            }else{
                return res.json({status: false})
            }
        }catch(error){
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }

    static async getAssessmentDataByAssignment(req:Request, res:Response) {
        try{
            const {id} = req.params

            const assignment = await assignmentRepository.findOne({where:{id}})
            if(!assignment) return res.status(404).json({message:'Assignment not found'})

            const peerAssessments = await peerAssessmentRepository.find({
                where:{
                    group:{
                        assignment:{
                            id: id
                        }
                    }
                },
                relations: ["group","receiver","giver"]
            })

            const selfAssessments = await selfAssessmentRepository.find({
                where:{
                    group:{
                        assignment:{
                            id:id
                        }
                    }
                },
                relations: ["group","user"]
            })

            const formattedAssessmentData = []
            for(const assessment of peerAssessments){
                const exists = formattedAssessmentData.find(userData => userData.id === assessment.receiver.id)
                const total = peerAssessments.filter(x => x.receiver.id === assessment.receiver.id)
                const selfAssessment = selfAssessments.find(ass => ass.user.id === assessment.receiver.id)
                if(exists){
                    exists.score += assessment.score / total.length
                    exists.peerFeedback = assessment.feedback ? [...exists.peerFeedback, assessment.feedback] : exists.peerFeedback
                }else{
                    formattedAssessmentData.push({
                        id: assessment.receiver.id,
                        user: assessment.receiver,
                        peerScore: assessment.score / total.length,
                        peerFeedback: assessment.feedback ? [assessment.feedback] : [],
                        selfScore: selfAssessment?.score || 0,
                        selfFeedback: selfAssessment?.feedback || "",
                        group: assessment.group
                    })
                }
            }

            return res.json(formattedAssessmentData)
        }catch(error){
            return res.status(500).json({ message: "Internal Server Error", error })
        }
    }
}