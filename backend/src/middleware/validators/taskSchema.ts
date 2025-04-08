import { NextFunction, Request, Response } from "express";
import * as yup from "yup";


const taskSchema = yup.object().shape({
    description: yup.string().min(3, "Description must be at least 3 characters").max(255, "Description must be at most 255 characters").required("Description is required"),
    status: yup.string().oneOf(["to_do", "in_progress", "completed","stuck"], "Invalid status").required("Status is required"),
    priorityLevel: yup.string().oneOf(["low", "medium", "high"], "Invalid priority level").required("Priority level is required"),
    userId: yup.string().uuid("Invalid user ID").required("User ID is required"),
    groupId: yup.string().uuid("Invalid group ID").required("Group ID is required"),
    dueDate: yup.date().required("Due date is required").typeError("Due date must be a valid date")
})

const updateTaskSchema = yup.object().shape({
    description: yup.string().min(3, "Description must be at least 3 characters").max(255, "Description must be at most 255 characters").optional(),
    status: yup.string().oneOf(["to_do", "in_progress", "completed", "stuck"], "Invalid status").optional(),
    priorityLevel: yup.string().oneOf(["low", "medium", "high"], "Invalid priority level").optional(),
    userId: yup.string().uuid("Invalid user ID").optional(),
    dueDate: yup.date().typeError("Due date must be a valid date").optional(),
})

export const validateTaskCreation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await taskSchema.validate(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Validation Error",
            errors: error.errors,
        });
    }
}

export const validateTaskUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateTaskSchema.validate(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Validation Error",
            errors: error.errors,
        })
    }
}