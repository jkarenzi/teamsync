import { User } from "./authFormData";

export interface Message {
    id: string,
    sender: User,
    content: string,
    createdAt: string
}

export interface sendMessageFormData {
    groupId: string,
    content: string
}