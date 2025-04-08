import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook, getInstructorToken, getStudentToken, testStudent, testInstructor } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Group Controller Tests', () => {
  let instructorToken: string;
  let studentToken: string;
  let studentId: string;
  let anotherStudentId:string;
  let classId: string;
  let groupId: string;
  let assignmentId:string

  beforeAll(async () => {
    const studentResponseOne = await request(app)
      .post('/api/auth/signup')
      .send({
        fullName: 'Test Student Two',
        email: 'teststudent2@gmail.com',
        password: 'test123456789',
        program: 'BSE',
        intake: 'May',
        startYear: '2022',
        userType: 'user'
      });

    anotherStudentId = studentResponseOne.body.data.id;  

    const studentResponse = await request(app)
      .post('/api/auth/signup')
      .send(testStudent);
    
    studentId = studentResponse.body.data.id;
    instructorToken = await getInstructorToken();
    studentToken = await getStudentToken();
    
    const className = `Test Class ${Date.now()}`;
    const classResponse = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: className,
        description: 'Test class for groups',
        userIds: [studentId, anotherStudentId]
      });
    
    classId = classResponse.body.id;

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
  });
  
  it('should create a new group successfully', async () => {
    const groupName = `Test Group ${Date.now()}`;
    
    const response = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: groupName,
        assignmentId: assignmentId,
        userIds: [studentId]
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', groupName);
    expect(response.body).toHaveProperty('id');
    expect(response.body.users).toHaveLength(1);
    expect(response.body.users[0].id).toBe(studentId)
    
    groupId = response.body.id;
  });
  
  it('should get a student group for a specific assignment', async () => {
    const response = await request(app)
      .get(`/api/groups/${assignmentId}/own`)
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', groupId);
  });

  it('should get all groups by assignment', async () => {
    const response = await request(app)
      .get(`/api/groups/${assignmentId}`)
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get all members without groups for a specific assignment', async () => {
    const response = await request(app)
      .get(`/api/groups/${assignmentId}/nogrps`)
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].id).toBe(anotherStudentId)
  });
  
  it('should update a group', async () => {
    const updatedName = `Updated Group ${Date.now()}`;
    
    const response = await request(app)
      .patch(`/api/groups/${groupId}`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: updatedName,
        userIds:[studentId, anotherStudentId]
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', updatedName);
  });

  it('should return a 404 for non-existent group Id upon update', async () => {
    const updatedName = `Updated Group ${Date.now()}`;
    
    const response = await request(app)
      .patch(`/api/groups/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: updatedName,
        userIds:[studentId, anotherStudentId]
      });
    
    expect(response.status).toBe(404)
  });
  
  it('should fail to update group without instructor permissions', async () => {
    const response = await request(app)
      .patch(`/api/groups/${groupId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'Student attempt',
        userIds:[studentId, anotherStudentId]
      });
    
    expect(response.status).toBe(403);
  });
  
  it('should delete a group', async () => {
    const response = await request(app)
      .delete(`/api/groups/${groupId}`)
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(200);
  });

  it('should return a 404 for non-existent groupId upon delete', async () => {
    const response = await request(app)
      .delete(`/api/groups/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(404);
  });
});