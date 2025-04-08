import { AppDataSource } from "../dbConfig";
import request from 'supertest'
import app from '../app'


export const beforeAllHook = async() => {
    await AppDataSource.initialize();
    await AppDataSource.synchronize(true);
    console.log('DB Connected...')
}

export const afterAllHook = async() => {
   await AppDataSource.destroy()
   console.log('DB Disconnected...')
}

export const testStudent = {
    fullName: 'Test Student',
    email: 'teststudent@gmail.com',
    password: 'test123456789',
    program: 'BSE',
    intake: 'May',
    startYear: '2022',
    userType: 'user'
}

export const testInstructor = {
    fullName: 'Test Instructor',
    email: 'testinstructor@gmail.com',
    password: 'test123456789',
    userType: 'instructor'
}

export const getStudentToken = async() => {
    await request(app).post('/api/auth/signup').send(testStudent);
    const loginResponse = await request(app).post('/api/auth/login').send({
        email: testStudent.email, 
        password: testStudent.password
    });
    return loginResponse.body.token;
}

export const getInstructorToken = async() => {
    await request(app).post('/api/auth/signup').send(testInstructor);
    const loginResponse = await request(app).post('/api/auth/login').send({
        email: testInstructor.email, 
        password: testInstructor.password
    });
    return loginResponse.body.token;
}