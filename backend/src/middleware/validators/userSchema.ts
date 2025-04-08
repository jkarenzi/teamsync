import { NextFunction } from 'express';
import * as yup from 'yup'
import {Request, Response} from 'express'

const userStatusSchema = yup.object().shape({
    active: yup.boolean().required()
})

const userRoleSchema = yup.object().shape({
    role: yup.string().oneOf(['instructor', 'user']).required()
})

export const validateUserStatusSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userStatusSchema.validate(req.body, { abortEarly: false })
        next();
    } catch (error) {
        console.log(error.errors)
        res.status(400).json({
            status: "error",
            message: "validation Error",
            errors: error.errors,
        });
    }
};

export const validateUserRoleSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await userRoleSchema.validate(req.body, { abortEarly: false })
        next();
    } catch (error) {
        console.log(error.errors)
        res.status(400).json({
            status: "error",
            message: "validation Error",
            errors: error.errors,
        });
    }
};