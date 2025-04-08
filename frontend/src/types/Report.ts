import { PeerAssessment, SelfAssessment } from "./Assessment";
import { Task } from "./Task";

export interface ReportData {
    userId:string,
    fullName:string,
    assignedTasks: number,
    tasks: Task[],
    selfAssessment: SelfAssessment | null,
    peerAssessments: PeerAssessment[],
    totalMessages: number,
    totalHoursLoggedIn: number,
    totalCommits: number
}