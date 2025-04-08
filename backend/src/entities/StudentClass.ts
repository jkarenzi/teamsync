import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany, Relation } from "typeorm";
import User from "./User";
import Assignment from "./Assignment";

@Entity()
class StudentClass {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('text', { unique: true })
    name: string;

    @Column({ type: "text" })
    description: string;

    @ManyToMany(() => User, (user) => user.classes)
    students: Relation<User[]>

    @OneToMany(() => Assignment, (assignment) => assignment.studentClass)
    assignments: Relation<Assignment[]>

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default StudentClass