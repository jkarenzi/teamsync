import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Relation } from "typeorm";
import User from "./User";
import Assignment from "./Assignment";


@Entity()
class AssignmentReminder {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Assignment, (assignment) => assignment.reminders, {onDelete: 'CASCADE'})
    assignment: Relation<Assignment>

    @ManyToOne(() => User, (user) => user.reminders)
    user: Relation<User>

    @Column({
        type: 'enum',
        enum: ['pending','sent'],
        default: 'pending'
    })
    status: 'pending'|'sent'

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default AssignmentReminder