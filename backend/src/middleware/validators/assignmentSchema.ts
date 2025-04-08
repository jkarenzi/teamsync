import { NextFunction, Request, Response } from "express";
import * as yup from "yup";


const createAssignmentSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().nullable(),
    dueDate: yup.date().required("Due date is required").typeError("Due date must be a valid date"),
    classId: yup.string().uuid().required('Class is required'),
    technical: yup.boolean().required('This field is required') 
})


const updateAssignmentSchema = yup.object().shape({
    name: yup.string(),
    description: yup.string().nullable(),
    dueDate: yup.date().typeError("Due date must be a valid date"),
    classId: yup.string().uuid()  
})

export const validateCreateAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await createAssignmentSchema.validate(req.body, { abortEarly: false })
        next()
    } catch (error) {
        console.log(error.errors)
        res.status(400).json({
            status: "error",
            message: "Validation Error",
            errors: error.errors,
        })
    }
}

export const validateUpdateAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateAssignmentSchema.validate(req.body, { abortEarly: false })
        next()
    } catch (error) {
        console.log(error.errors)
        res.status(400).json({
            status: "error",
            message: "Validation Error",
            errors: error.errors,
        });
    }
}