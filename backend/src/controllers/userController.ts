import { Request, Response } from "express";
import User from "../entities/User";
import { AppDataSource } from "../dbConfig";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import moment from "moment-timezone";
import pusher from "../utils/pusher";
import Group from "../entities/Group";
import Session from "../entities/Session";
import sendEmail from "../utils/emails/sendMail";
import { IsNull } from "typeorm";
dotenv.config()


const userRepository = AppDataSource.getRepository(User)
const groupRepository = AppDataSource.getRepository(Group)
const sessionRepository = AppDataSource.getRepository(Session)

export async function signUp (req:Request,res:Response) {
    try{
        const formData = req.body;
        
        const user = await userRepository.findOne({where:{ email: formData.email }});
        if (user) {
            return res
            .status(409)
            .json({ status: 'error', message: 'Email already in use' });
        }
        
        const hashedPassword = await bcrypt.hash(formData.password, 10);
        
        const newUser = new User()

        newUser.fullName = formData.fullName
        newUser.email = formData.email
        newUser.password = hashedPassword
        newUser.role = formData.userType
        if(formData.userType === 'user'){
            newUser.program = formData.program
            newUser.startYear = formData.startYear
            newUser.intake = formData.intake

            if(formData.githubUsername){
                newUser.githubUsername = formData.githubUsername
            }
        }
          
        const savedUser = await userRepository.save(newUser)

        sendEmail('welcome', savedUser.email, {name: savedUser.fullName})
        
        return res
            .status(201)
            .json({ status: 'success', message: 'Signup successful!', data:{id: savedUser.id, email: savedUser.email} });
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export async function login (req:Request,res:Response) {
    try{
        const formData = req.body;

        const user = await userRepository.findOne({where:{ email: formData.email }});
        if (!user) {
            return res
            .status(404)
            .json({ status: 'error', message: 'Account not found' });
        }

        if(!user.active){
            return res.status(409).json({status:'error', message: 'Your account has been disactivated. Please contact administrator'})
        }
        
        const passwordMatch: boolean = await bcrypt.compare(
            formData.password,
            user.password
        );
        if (!passwordMatch) {
            return res
            .status(401)
            .json({ status: 'error', message: 'Incorrect password' });
        }

        const existingSession = await sessionRepository.findOne({
            where:{
                user:{id: user.id},
                logoutAt: IsNull()
            }
        })

        if(!existingSession){
            const newSession = sessionRepository.create({
                user: user,
                loginAt: new Date()
            })

            await sessionRepository.save(newSession)
        }

        const token = await jwt.sign(
            {
                user:{
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }, 
            process.env.JWT_SECRET as string,
            {expiresIn: '1d'}
        )
        
        return res
            .status(200)
            .json({ status: 'success', message: 'Login successful', token });
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const logout = async(req:Request,res:Response) => {
    try{
        const userId = req.user.id
        const session = await sessionRepository.findOne({
            where:{
                user:{id: userId},
                logoutAt: IsNull()
            }
        })

        if(!session){
            return res.status(404).json({mesage:'No active session found'})
        }

        session.logoutAt = new Date()
        await sessionRepository.save(session)
        return res.json({message:'Logout successful'})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getOwnProfile(req:Request,res:Response) {
    const userId = req.user!.id

    try{
        const userProfile = await userRepository.findOne({
            where:{
                id: userId
            },
            relations:['assignments','tasks']
        })

        console.log(userProfile)

        return res.json(userProfile)
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export async function getAllUsers(req:Request,res:Response) {
    try{
        const { program, intake, startYear, role } = req.query;
        const whereConditions: any = {};
        
        if (program) whereConditions.program = program;
        if (intake) whereConditions.intake = intake;
        if (startYear) whereConditions.startYear = startYear;
        if (role) whereConditions.role = role

        const users = await userRepository.find({
            where:whereConditions,
            order:{
                createdAt: 'DESC'
            }
        })

        return res.json(users)
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export async function changeUserStatus(req:Request,res:Response) {
    try{
        const {active} = req.body
        const userId = req.params.id
        
        const user = await userRepository.findOne({
            where:{
                id: userId
            }
        })

        user.active = active
        await userRepository.save(user)

        return res.json(user)
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export async function changeUserRole(req:Request,res:Response) {
    try{
        const {role} = req.body
        const userId = req.params.id
        
        const user = await userRepository.findOne({
            where:{
                id: userId
            }
        })

        user.role = role
        await userRepository.save(user)

        return res.json(user)
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const changePassword = async (req:Request, res: Response) => {
    try{
        const userId = req.user.id
        const {oldPassword, newPassword} = req.body
    
        const user = await userRepository.findOne({where:{id: userId}})
    
        const passwordMatch: boolean = await bcrypt.compare(oldPassword, user.password)

        if (!passwordMatch) {
            return res
            .status(401)
            .json({ status: 'error', message: 'Incorrect password' });
        }
  
      const hashedPassword = await bcrypt.hash(oldPassword, 10)
      user.password = hashedPassword
  
      await userRepository.save(user)
  
      return res.json({status:'success', message:'Password changed successfully. Please login again'})
    }catch(err){
      return res.status(500).json({message: 'Internal Server Error', status:'error'})
    }
}

export const authenticatePusher = async(req:Request,res:Response) => {
    try{
        const socketId = req.body.socket_id;
        const channel = req.body.channel_name;

        const groupId = channel.split("-").slice(2,).join("-")
        const userId = req.user!.id

        const group = await groupRepository
            .createQueryBuilder("group")
            .leftJoin("group.users", "user")
            .where("group.id = :groupId", { groupId })
            .andWhere("user.id = :userId", { userId })
            .getOne()  

        if(!group){
            return res.send('Forbidden');
        } 

        const data = {
            user_id: req.user!.id,
            user_info:{
                name: req.user!.fullName
            }
        }

        const authResponse = pusher.authorizeChannel(socketId, channel, data);
        return res.send(authResponse)
    }catch(err){
        return res.send('Forbidden');
    }
}

export const editProfile = async(req: Request, res: Response) => {
    try{
        const userId = req.user.id
        const {fullName, profileImg, program, githubUsername} = req.body

        const user = await userRepository.findOne({
            where:{id: userId},
            relations:['assignments','tasks']
        })

        user.fullName = fullName ?? user.fullName
        user.profileImg = profileImg ?? user.profileImg

        if(user.githubUsername){
            user.githubUsername = githubUsername
        }
        
        if(program){
            user.program = program
        }

        await userRepository.save(user)

        return res.json(user)
    }catch(err){
        return res.status(500).json({message: 'Internal Server Error', status:'error'})
    }
}