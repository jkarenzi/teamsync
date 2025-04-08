export interface IUser {
    id:string,
    email:string,
    role: 'instructor' | 'user',
    createdAt:Date,
    updatedAt: Date,
    fullName: string
}

declare module 'express-serve-static-core' {
    interface Request {
      user?: IUser
    }
}