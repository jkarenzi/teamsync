import { User } from "./authFormData";


export interface Notification {
    id:string,
    message:string,
    user: User,
    read:boolean,
    createdAt:string
}