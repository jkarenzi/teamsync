import request from 'supertest';
import app from '../app'
import { afterAllHook, beforeAllHook, getInstructorToken, getStudentToken, testInstructor, testStudent } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);


describe('Validation Tests', () => {
    let studentToken: string;
    let instructorToken: string;

    beforeAll(async () => {
        studentToken = await getStudentToken()
        instructorToken = await getInstructorToken()
    })
    
    it('should fail to register a new student if data doesnt pass validation', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
            ...testStudent,
            email:''
        })
      
      expect(response.status).toBe(400);
    });

    it('should fail to create a new assignment if data doesnt pass validation', async () => {
        const assignmentTitle = `Test Assignment ${Date.now()}`;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        
        const response = await request(app)
          .post('/api/assignments')
          .set('Authorization', `Bearer ${instructorToken}`)
          .send({
            name: assignmentTitle,
            description: 'Test assignment description',
            classId: '',
            dueDate: dueDate.toISOString(),
            technical:false
          });
        
        expect(response.status).toBe(400);
    });

    it('should fail to create a new class if data doesnt pass validation', async () => {
        const className = `Test Class ${Date.now()}`;
        
        const response = await request(app)
          .post('/api/classes')
          .set('Authorization', `Bearer ${instructorToken}`)
          .send({
            name: className,
            description: '',
            userIds: []
          });
        
        expect(response.status).toBe(400);
    }); 

    it('should fail to create a new group if data doesnt pass validation', async () => {
        const groupName = `Test Group ${Date.now()}`;
        
        const response = await request(app)
          .post('/api/groups')
          .set('Authorization', `Bearer ${instructorToken}`)
          .send({
            name: groupName,
            assignmentId: '',
            userIds: []
          });
        
        expect(response.status).toBe(400);
    })

    it('should fail to create a new task if data doesnt pass validation', async () => {
        const taskTitle = `Test Task ${Date.now()}`;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 5);
        
        const response = await request(app)
          .post('/api/tasks')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({
            priorityLevel: 'low',
            status:'to_do',
            description: taskTitle,
            dueDate: dueDate.toISOString(),
            groupId: '',
            userId: ''
          });
        
        expect(response.status).toBe(400);
    });
})