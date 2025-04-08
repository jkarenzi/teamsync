import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook, getInstructorToken, getStudentToken, testStudent, testInstructor } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Assignment Controller Tests', () => {
  let instructorToken: string;
  let studentToken: string;
  let classId: string;
  let assignmentId: string;
  let studentId:string

  beforeAll(async () => {
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
        description: 'Test class for assignments',
        userIds: [studentId]
      });
    
    classId = classResponse.body.id;
  });
  
  it('should create a new assignment successfully', async () => {
    const assignmentTitle = `Test Assignment ${Date.now()}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    
    const response = await request(app)
      .post('/api/assignments')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: assignmentTitle,
        description: 'Test assignment description',
        classId: classId,
        dueDate: dueDate.toISOString(),
        technical:false
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', assignmentTitle);
    expect(response.body).toHaveProperty('description', 'Test assignment description');
    expect(response.body).toHaveProperty('id');
    
    assignmentId = response.body.id;
  });
  
  it('should get all assignments', async () => {
    const response = await request(app)
      .get('/api/assignments')
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get all assignments by instructor', async () => {
    const response = await request(app)
      .get('/api/assignments/instructor')
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get all assignments by student', async () => {
    const response = await request(app)
      .get('/api/assignments/own')
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
  
  it('should get a specific assignment by ID', async () => {
    const response = await request(app)
      .get(`/api/assignments/${assignmentId}`)
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', assignmentId);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
  });
  
  it('should update an assignment', async () => {
    const updatedTitle = `Updated Assignment ${Date.now()}`;
    
    const response = await request(app)
      .patch(`/api/assignments/${assignmentId}`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: updatedTitle,
        description: 'Updated description'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', updatedTitle);
    expect(response.body).toHaveProperty('description', 'Updated description');
  });
  
  it('should fail to update assignment with non-existent ID', async () => {
    const response = await request(app)
      .patch(`/api/assignments/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: 'Will fail',
        description: 'This should fail'
      });
    
    expect(response.status).toBe(404);
  });
  
  it('should fail to update assignment without instructor permissions', async () => {
    const response = await request(app)
      .patch(`/api/assignments/${assignmentId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        name: 'Student attempt',
        description: 'This should fail'
      });
    
    expect(response.status).toBe(403);
  });
  
  it('should delete an assignment', async () => {
    const response = await request(app)
      .delete(`/api/assignments/${assignmentId}`)
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(200);
  });

  it('should fail to delete assignment with non-existent ID', async () => {
    const response = await request(app)
      .delete(`/api/assignments/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(404);
  });
});