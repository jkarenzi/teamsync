import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, Relation } from "typeorm";
import Group from "./Group";
import User from "./User";
import StudentClass from "./StudentClass";
import AssignmentReminder from "./AssignmentReminder";

@Entity()
class Assignment {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 255 })
    name: string

    @Column({ type: "text", nullable: true })
    description: string

    @Column({ type: "timestamptz" })
    dueDate: Date

    @ManyToOne(() => StudentClass, (studentClass) => studentClass.assignments, {onDelete:'CASCADE'})
    studentClass: Relation<StudentClass>

    @ManyToOne(() => User, (user) => user.assignments)
    instructor: Relation<User>

    @OneToMany(() => AssignmentReminder, (reminder) => reminder.assignment)
    reminders: Relation<AssignmentReminder[]>

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date

    @OneToMany(() => Group, (group) => group.assignment)
    groups: Relation<Group[]>

    @Column('boolean',{default:false})
    technical: boolean
}

export default Assignment