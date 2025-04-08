import { LessThan, IsNull, MoreThan } from "typeorm";
import { AppDataSource } from "../dbConfig";
import Session from "../entities/Session";
import Task from "../entities/Task";
import PeerAssessment from "../entities/PeerAssessment";
import SelfAssessment from "../entities/SelfAssessment";
import Message from "../entities/Message";


const sessionRepository = AppDataSource.getRepository(Session);
const taskRepository = AppDataSource.getRepository(Task);
const peerAssessmentRepository = AppDataSource.getRepository(PeerAssessment);
const selfAssessmentRepository = AppDataSource.getRepository(SelfAssessment);
const messageRepository = AppDataSource.getRepository(Message);


export const logoutInactiveUsers = async (inactivityThresholdhours: number = 4): Promise<void> => {
  try {
    console.log(`Running inactive user logout check (threshold: ${inactivityThresholdhours} hours)`);
    
    const thresholdDate = new Date();
    thresholdDate.setHours(thresholdDate.getHours() - inactivityThresholdhours);


    const activeSessions = await sessionRepository.find({
      where: { logoutAt: IsNull() },
      relations: ["user"]
    });
    
    console.log(`Found ${activeSessions.length} active sessions`);
    
    for (const session of activeSessions) {
      const userId = session.user.id;
      
      const recentTask = await taskRepository.findOne({
        where: [
          { user: { id: userId }, createdAt: MoreThan(thresholdDate) },
        ],
        order: { createdAt: "DESC" }
      });
      
      const recentPeerAssessment = await peerAssessmentRepository.findOne({
        where: { giver: { id: userId }, createdAt: MoreThan(thresholdDate) },
        order: { createdAt: "DESC" }
      });
      
      const recentSelfAssessment = await selfAssessmentRepository.findOne({
        where: { user: { id: userId }, createdAt: MoreThan(thresholdDate) },
        order: { createdAt: "DESC" }
      });
      
      const recentMessage = await messageRepository.findOne({
        where: { sender: { id: userId }, createdAt: MoreThan(thresholdDate) },
        order: { createdAt: "DESC" }
      });
      
      if (!recentTask && !recentPeerAssessment && !recentSelfAssessment && !recentMessage) {
        console.log(`Logging out inactive user: ${userId}, session ID: ${session.id}`);
        
        session.logoutAt = new Date();
        await sessionRepository.save(session);
      }
    }
    
    console.log("Inactive user logout completed");
  } catch (error) {
    console.error("Error in logoutInactiveUsers:", error);
  }
};


export default logoutInactiveUsers;