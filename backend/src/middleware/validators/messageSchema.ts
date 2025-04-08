import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';


const sendMessageSchema = yup.object().shape({
    content: yup.string().required("Message content is required"),
    groupId: yup.string().uuid("Invalid group ID format").required("Group ID is required")
});

export const validateSendMessageSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await sendMessageSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        console.log(error.errors);
        res.status(400).json({
            status: "error",
            message: "Validation Error",
            errors: error.errors,
        });
    }
};
