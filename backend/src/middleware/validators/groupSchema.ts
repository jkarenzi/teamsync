import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';


const createGroupSchema = yup.object().shape({
    name: yup.string().required("Group name is required"),
    assignmentId: yup.string().uuid("Assignment ID must be a valid UUID").required("Assignment ID is required"),
    userIds: yup.array().of(yup.string().uuid("Each user ID must be a valid UUID")).min(1, "At least one user is required").required("User IDs are required"),
})


const updateGroupSchema = yup.object().shape({
    name: yup.string(),
    userIds: yup.array().of(yup.string().uuid("Each user ID must be a valid UUID")).min(1, "At least one user is required"),
})


const autoAssignGroupsSchema = yup.object().shape({
    assignmentId: yup.string().uuid("Assignment ID must be a valid UUID").required("Assignment ID is required"),
    userIds: yup.array().of(yup.string().uuid("Each user ID must be a valid UUID")).min(1, "At least one user is required").required("User IDs are required"),
    groupSize: yup.number().min(1, "Group size must be at least 1").required("Group size is required"),
})


export const validateCreateGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await createGroupSchema.validate(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Validation error",
            errors: error.errors,
        });
    }
}


export const validateUpdateGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateGroupSchema.validate(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Validation error",
            errors: error.errors,
        });
    }
}


export const validateAutoAssignGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await autoAssignGroupsSchema.validate(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Validation error",
            errors: error.errors,
        });
    }
}
