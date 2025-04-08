import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook, getInstructorToken, testStudent, testInstructor } from './testSetup';


beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Student Class Controller Tests', () => {
  let instructorToken: string;
  let studentId: string;
  let classId: string;

  beforeAll(async () => {
    const studentResponse = await request(app)
      .post('/api/auth/signup')
      .send(testStudent);
    
    studentId = studentResponse.body.data.id;
    instructorToken = await getInstructorToken();
  })
  
  it('should create a new class successfully', async () => {
    const className = `Test Class ${Date.now()}`;
    
    const response = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: className,
        description: 'Test class description',
        userIds: [studentId]
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', className);
    expect(response.body).toHaveProperty('description', 'Test class description');
    expect(response.body).toHaveProperty('id');
    
    classId = response.body.id;
  });
  
  it('should fail when creating class with duplicate name', async () => {
    const existingClassName = `Test Class ${Date.now()}`;
    
    await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: existingClassName,
        description: 'First class',
        userIds: [studentId]
      });
    
    const response = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: existingClassName,
        description: 'Second class with same name',
        userIds: [studentId]
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Class with this name already exists');
  });
  
  it('should get all classes', async () => {
    const response = await request(app)
      .get('/api/classes')
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
  
  it('should update a class', async () => {
    const updatedDescription = 'Updated description';
    
    const response = await request(app)
      .patch(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        description: updatedDescription,
        userIds: []
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('description', updatedDescription);
  });

  it('should return a 404 if class is not found upon update', async () => {
    const updatedDescription = 'Updated description';
    
    const response = await request(app)
      .patch(`/api/classes/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        description: updatedDescription,
        userIds: []
      });
    
    expect(response.status).toBe(404);
  });

  
  it('should delete a class', async () => {
    const response = await request(app)
      .delete(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(200);
  });

  it('should return a 404 if class is not found upon update delete', async () => {
    const response = await request(app)
      .delete(`/api/classes/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${instructorToken}`);
    
    expect(response.status).toBe(404);
  });
});