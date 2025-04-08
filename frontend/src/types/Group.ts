import { User } from "./authFormData";
import { Task } from "./Task";

export interface Group {
    id :string,
    name: string,
    users: User[],
    tasks: Task[],
    githubRepoName: string | null,
    githubRepoLink: string | null
}

export interface createGroupFormData {
    name: string,
    userIds: string[]
}

export interface updateGroupFormData {
    name?:string,
    userIds?: string[]
}

export interface IUpdateGroupFormData {
    id:string,
    formData: updateGroupFormData
}