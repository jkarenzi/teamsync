import request from 'supertest';
import app from '../app'
import { afterAllHook, beforeAllHook, testInstructor, testStudent } from './testSetup';

beforeAll(beforeAllHook);
afterAll(afterAllHook);


describe('User Controller Tests', () => {
    let studentToken: string;
    let instructorToken: string;
    
    it('should register a new student successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testStudent)
      
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('email', testStudent.email);
    });
    
    it('should register a new instructor successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testInstructor);
      
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('email', testInstructor.email);
    });
    
    it('should fail registration with duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testStudent);
      
      expect(response.status).toBe(409)
    })
    
    it('should login student successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testStudent.email,
          password: testStudent.password
        })
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      studentToken = response.body.token
    });
    
    it('should login instructor successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testInstructor.email,
          password: testInstructor.password
        });
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      instructorToken = response.body.token
    });
    
    it('should fail login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testStudent.email,
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401)
    })
    
    it('should get student profile with valid token', async () => {
      const response = await request(app)
        .get('/api/user/own')
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', testStudent.email);
      expect(response.body).toHaveProperty('role', 'user');
    })
    
    it('should get instructor profile with valid token', async () => {
      const response = await request(app)
        .get('/api/user/own')
        .set('Authorization', `Bearer ${instructorToken}`);
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('email', testInstructor.email)
      expect(response.body).toHaveProperty('role', 'instructor')
    });
    
    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/user/own')
      
      expect(response.status).toBe(401)
    })

    it('should edit user profile successfully', async () => {
      const profileResponse = await request(app)
        .patch('/api/user')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          fullName: testStudent.fullName,
          program:testStudent.program,
          profileImg:'http://testImg.png'
        }) 
      
      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body).toHaveProperty('profileImg', 'http://testImg.png');
    });

    it('should change password successfully', async () => {
      const changeResponse = await request(app)
        .post('/api/user/change_password')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          oldPassword: testStudent.password,
          newPassword: 'NewPassword456!'
        });
      
      expect(changeResponse.status).toBe(200)
      
      // Change back for other tests
      await request(app)
        .post('/api/user/change_password')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          oldPassword: 'NewPassword456!',
          newPassword: testStudent.password
        });
    });
  
    it('should not change password with incorrect old password', async () => {
      const changeResponse = await request(app)
        .post('/api/user/change_password')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          oldPassword: 'WrongPassword!',
          newPassword: 'NewPassword456!'
        });
      
      expect(changeResponse.status).toBe(401)
    });
})