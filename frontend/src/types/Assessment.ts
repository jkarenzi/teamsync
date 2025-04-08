import { User } from "./authFormData";

export interface PeerAssessmentFormData {
    receiverId: string; 
    groupId: string;
    involvement: number;
    completion: number;
    collaboration: number;
    leadership: number;
    overallContribution: number;
    feedback: string;
}

export interface SelfAssessmentFormData { 
    groupId: string;
    involvement: number;
    completion: number;
    collaboration: number;
    leadership: number;
    overallContribution: number;
    feedback: string;
}

export interface SelfAssessment {
    id:string,
    score:number,
    feedback:string
}

export interface PeerAssessment {
    id:string,
    score:number,
    feedback:string,
    giver: User,
    receiver: User
}
