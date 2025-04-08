import request from 'supertest';
import app from '../app';
import { afterAllHook, beforeAllHook, getInstructorToken, getStudentToken, testStudent, testInstructor } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);

describe('Task Controller Tests', () => {
  let instructorToken: string;
  let studentToken: string;
  let studentId: string;
  let groupId: string;
  let assignmentId: string;
  let taskId: string;

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
        description: 'Test class for tasks',
        userIds: [studentId]
      });
    
    const classId = classResponse.body.id;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const assignmentResponse = await request(app)
      .post('/api/assignments')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        name: `Test Assignment ${Date.now()}`,
        description: 'Test assignment for tasks',
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
        userIds: [studentId]
      });
    
    groupId = groupResponse.body.id;
  });
  
  it('should create a new task successfully', async () => {
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
        groupId: groupId,
        userId: studentId
      });

      console.log(response.body);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('description', taskTitle);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('status', 'to_do');
    
    taskId = response.body.id;
  });
  
  it('should get all tasks for a group', async () => {
    const response = await request(app)
      .get(`/api/tasks/group/${groupId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id', taskId);
  });
  
  it('should update a task', async () => {
    const taskTitle = `Test Task ${Date.now()}`
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5);
    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        priorityLevel: 'low',
        status:'completed',
        description: taskTitle,
        dueDate: dueDate.toISOString(),
        userId: studentId
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'completed');
  });
  
  it('should return a 404 on non-existent task id upon update', async () => {
    const taskTitle = `Test Task ${Date.now()}`
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 5);
    const response = await request(app)
      .patch(`/api/tasks/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        priorityLevel: 'low',
        status:'completed',
        description: taskTitle,
        dueDate: dueDate.toISOString(),
        userId: studentId
      });
    
    expect(response.status).toBe(404);
  });
  
  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(response.status).toBe(200);
  });

  it('should return a 404 on non-existent task id upon delete', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(response.status).toBe(404);
  });
});