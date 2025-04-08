import { User } from "./authFormData";
import { Group } from "./Group";

export interface Task {
    id: string
    description: string
    status: "to_do" | "in_progress" | "completed" | "stuck"
    priorityLevel: "low" | "medium" | "high"
    user: User
    dueDate: string
    group: Group
}

export interface CreateTaskFormData {
    description: string;
    status: "to_do" | "in_progress" | "completed" | "stuck"
    priorityLevel: "low" | "medium" | "high"
    userId: string;
    dueDate: string;
    groupId: string;
}

export interface UpdateTaskFormData {
    description?: string
    status?: "to_do" | "in_progress" | "completed" | "stuck"
    priorityLevel?: "low" | "medium" | "high"
    userId?: string
    dueDate?: string
    groupId?: string
}

export interface IUpdateTaskFormData {
    id: string
    formData: UpdateTaskFormData
}