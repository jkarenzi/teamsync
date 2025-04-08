import { User } from "./authFormData";

export interface StudentClass {
    id:string,
    name:string,
    description: string,
    students: User[]
}

export interface createClassFormData {
    name:string,
    description: string,
    userIds: string[]
}

export interface updateClassFormData {
    formData: createClassFormData,
    id:string
}