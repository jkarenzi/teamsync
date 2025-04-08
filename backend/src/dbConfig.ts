import { DataSource } from "typeorm";
import dotenv from 'dotenv'
import User from "./entities/User";
import Group from "./entities/Group";
import Task from "./entities/Task";
import Assignment from "./entities/Assignment";
import Message from "./entities/Message";
import PeerAssessment from "./entities/PeerAssessment";
import SelfAssessment from "./entities/SelfAssessment";
import Session from "./entities/Session";
import StudentClass from "./entities/StudentClass";
import Notification from "./entities/Notification";
import TaskReminder from "./entities/TaskReminder";
import AssignmentReminder from "./entities/AssignmentReminder";
import GithubContributionData from "./entities/GithubContributionData";
dotenv.config()

const nodeEnv = process.env.NODE_ENV

const env = {
    PROD:{
        host: process.env.DB_HOST as string,
        database: process.env.DB_NAME as string,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT as string) : 5432,
        username: process.env.DB_USER as string,
        password: process.env.DB_PASS as string
    },
    DEV:{
        host: process.env.DB_HOST as string,
        database: process.env.DB_NAME as string,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT as string) : 5432,
        username: process.env.DB_USER as string,
        password: process.env.DB_PASS as string
    },
    TEST:{
        host: process.env.TEST_DB_HOST as string,
        database: process.env.TEST_DB_NAME as string,
        port: process.env.TEST_DB_PORT ? parseInt(process.env.TEST_DB_PORT as string) : 5432,
        username: process.env.TEST_DB_USER as string,
        password: process.env.TEST_DB_PASS as string
    }
}

const dbConfig = env[nodeEnv] || env.TEST;
console.log("Database configuration:", dbConfig);


export const AppDataSource = new DataSource({
    type: "postgres",
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: true,
    logging: false,
    entities: [User, Group, Task, Assignment, Message, PeerAssessment, SelfAssessment, Session, StudentClass, Notification, TaskReminder, AssignmentReminder, GithubContributionData],
    subscribers: [],
    migrations: [],
})