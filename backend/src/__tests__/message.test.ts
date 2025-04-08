import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook, getInstructorToken, getStudentToken, testStudent, testInstructor } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Message Controller Tests', () => {
  let studentToken: string;
  let groupId: string;
  let studentId: string;
  let secondStudentId: string;
  let assignmentId:string

  beforeAll(async () => {
    const studentResponse = await request(app)
      .post('/api/auth/signup')
      .send(testStudent);
    
    studentId = studentResponse.body.data.id;
    
    const secondStudent = {
      fullName: 'Second Student',
      email: `secondstudent${Date.now()}@example.com`,
      password: 'password123',
      program: 'BSE',
      intake: 'May',
      startYear: '2023',
      userType: 'user'
    };
    
    const secondStudentResponse = await request(app)
      .post('/api/auth/signup')
      .send(secondStudent);
    
    secondStudentId = secondStudentResponse.body.data.id;

    studentToken = await getStudentToken();
    const instructorToken = await getInstructorToken();
    
    const classResponse = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: `Test Class ${Date.now()}`,
        description: 'Test class for messages',
        userIds: [studentId, secondStudentId]
      });
    
    const classId = classResponse.body.id;

    const assignmentTitle = `Test Assignment ${Date.now()}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const assignmentResponse = await request(app).post('/api/assignments')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
            name: assignmentTitle,
            description: 'Test assignment description',
            classId: classId,
            dueDate: dueDate.toISOString(),
            technical:false
        });
    
    assignmentId = assignmentResponse.body.id;
    
    const groupResponse = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: `Test Group ${Date.now()}`,
        assignmentId: assignmentId,
        userIds: [studentId, secondStudentId]
      });
    
    groupId = groupResponse.body.id;
  });
  
  it('should send a direct message between users', async () => {
    const response = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        content: 'Hello, this is a test message!',
        groupId: groupId
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('content', 'Hello, this is a test message!');
    expect(response.body).toHaveProperty('id'); 
  });
  
  it('should get group messages', async () => {
    const response = await request(app)
      .get(`/api/messages/${groupId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('content');
  });
  
  it('should fail to send group message with missing groupId', async () => {
    const response = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        content: 'This should fail',
      });
    
    expect(response.status).toBe(400);
  });
});