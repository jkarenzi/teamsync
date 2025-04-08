import { User } from "./authFormData"
import { StudentClass } from "./StudentClass"


export interface Assignment {
    id : string,
    name: string,
    description: string,
    studentClass: StudentClass,
    dueDate: string,
    dueDateFormatted:string
    instructor: User,
    technical: boolean
}

export interface createAssignmentFormData {
    name: string,
    description: string,
    dueDate: string,
    classId: string,
    technical: boolean
}

export interface ICreateAssignmentFormData {
    name: string,
    description: string,
    dueDate: string,
    classId: string,
}

export interface updateAssignmentFormData {
    name?: string,
    description?: string,
    dueDate?: string,
    classId?: string
}

export interface IUpdateAssignmentFormData {
    id:string,
    formData: updateAssignmentFormData
}