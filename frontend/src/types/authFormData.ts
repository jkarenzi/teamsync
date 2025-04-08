import { Assignment } from "./Assignment"
import { Task } from "./Task"

export interface signupFormData {
    fullName: string,
    email: string,
    password: string,
    userType: string,
    startYear?:string,
    program?:string,
    intake?:string
}

export interface loginFormData {
    email: string
    password: string
}

export interface ApiResponse {
    message?: string,
    token?:string,
}

export interface User {
    id: string,
    fullName: string,
    email: string,
    role: 'user' | 'instructor',
    createdAt: string,
    profileImg: string,
    assignments: Assignment[],
    tasks: Task[],
    startYear?:string,
    program?:string,
    intake?:string,
    githubUsername:string | null
}

export interface changePasswordFormData {
    oldPassword: string,
    newPassword: string
}

export interface Member {
    id:string,
    info: {name: string}
}

export interface IMembers{
    [key:string]:{name: string}
}

export interface IMembersObject {
    members:IMembers
}

export interface editProfileFormData {
    fullName: string,
    profileImg: string,
    program?:string,
    githubUsername?:string | null
}