import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinTable,
    ManyToMany,
    Relation,
} from 'typeorm';
import dotenv from 'dotenv'
import Task from './Task';
import Group from './Group';
import Message from './Message';
import PeerAssessment from './PeerAssessment';
import SelfAssessment from './SelfAssessment';
import Assignment from './Assignment';
import Session from './Session';
import StudentClass from './StudentClass';
import Notification from './Notification';
import AssignmentReminder from './AssignmentReminder';
dotenv.config()

  
@Entity()
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column('text', { unique: true })
    email!: string

    @Column('text')
    fullName!: string

    @Column('text')
    password!: string

    @Column({
        type: 'text',
        default: process.env.DEFAULT_IMG,
        nullable:true
    })
    profileImg!: string

    @Column({
        type: "enum",
        enum: ['instructor','user'],
        default: 'user'
    })
    role!: 'instructor'|'user'

    @Column('boolean', {default: true})
    active!: boolean

    @Column('text', {nullable:true})
    program!: string

    @Column('text', {nullable:true})
    startYear!: string

    @Column('text', {nullable:true})
    intake!: string

    @Column('text',{nullable:true})
    githubUsername!:string

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[]

    @OneToMany(() => Session, (session) => session.user)
    sessions: Relation<Session[]>

    @ManyToMany(() => StudentClass, (studentClass) => studentClass.students)
    @JoinTable()
    classes: Relation<StudentClass[]>

    @ManyToMany(() => Group, (group) => group.users)
    @JoinTable()
    groups: Relation<Group[]>

    @OneToMany(() => Message, (message) => message.sender)
    messages: Relation<Message[]>

    @OneToMany(() => PeerAssessment, (peerAssessment) => peerAssessment.receiver)
    receivedPeerAssessments: Relation<PeerAssessment[]>

    @OneToMany(() => PeerAssessment, (peerAssessment) => peerAssessment.giver)
    givenPeerAssessments: Relation<PeerAssessment[]>

    @OneToMany(() => SelfAssessment, (selfAssessment) => selfAssessment.user)
    selfAssessments: Relation<SelfAssessment[]>

    @OneToMany(() => Assignment, (assignment) => assignment.instructor)
    assignments: Relation<Assignment[]>
    
    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Relation<Notification[]>

    @OneToMany(() => AssignmentReminder, (reminder) => reminder.user)
    reminders: Relation<AssignmentReminder[]>

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}