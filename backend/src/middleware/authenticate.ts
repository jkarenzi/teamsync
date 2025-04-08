import { Request, Response, NextFunction } from 'express';
import { IUser } from '../custom'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AppDataSource } from '../dbConfig';
import User from '../entities/User';
import Session from '../entities/Session';
import { IsNull } from 'typeorm';
dotenv.config()

interface Decoded {
    user: IUser
}

const userRepository = AppDataSource.getRepository(User)
const sessionRepository = AppDataSource.getRepository(Session)

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.header('Authorization');

  if (!header) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string) as Decoded;

    const user = await userRepository.findOneBy({id: decoded.user.id, active:true})
      const existingSession = await sessionRepository.findOne({
        where:{
            user:{id: user.id},
            logoutAt: IsNull()
        }
    })

    if(!user || !existingSession){
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    req.user = user

    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = req.user!.role
      if(!allowedRoles.includes(userRole)){
          return res.status(403).json({message:'Forbidden'})
      }
      next()
    }
}