import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, Relation } from "typeorm";
import Task from "./Task";

@Entity()
class TaskReminder {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => Task, (task) => task.reminder,{onDelete: 'CASCADE'})
    @JoinColumn()
    task: Relation<Task>

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

export default TaskReminder