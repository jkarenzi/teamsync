import { NextFunction } from 'express';
import * as yup from 'yup'
import {Request, Response} from 'express'

const signupSchema = yup.object().shape({
    fullName: yup.string().required(),
    email: yup.string().email("Must be a valid email").required("Email is required"),
    password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters long"),
    userType: yup.string().oneOf(['user', 'instructor']).required(),
    startYear: yup.string(),
    program: yup.string(),
    intake: yup.string(),
    githubUsername: yup.string().optional()    
});

const loginSchema = yup.object().shape({
    email: yup.string().email("Must be a valid email").required("Email is required"),
    password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters long"),
});

const changePasswordSchema = yup.object({
    oldPassword: yup.string().required("Password is required").min(8, "Password must be at least 8 characters long"),
    newPassword: yup.string().required("Password is required").min(8, "Password must be at least 8 characters long")
})

export const editProfileSchema = yup.object().shape({
    fullName: yup.string().required('Name is required'),
    profileImg: yup.string().required('Profile Image is required'),
    program: yup.string()
        .oneOf(['BSE', 'BEL'], 'Invalid program')
        .optional(),
    githubUsername: yup.string().optional()          
})

export const validateSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await signupSchema.validate(req.body, { abortEarly: false })
        next();
    } catch (error) {
        console.log(req.body)
        console.log(error.errors)
        res.status(400).json({
            status: "error",
            message: "validation Error",
            errors: error.errors,
        });
    }
};

export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await loginSchema.validate(req.body, { abortEarly: false })
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

export const validateChangePassword = async(req: Request, res: Response, next: NextFunction) => {
    try {
      await changePasswordSchema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Validation error", errors: err.errors });
    }
}  

export const validateEditProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
      await editProfileSchema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Validation error", errors: err.errors });
    }
}
  