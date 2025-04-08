import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToOne, Relation } from "typeorm";
import User from "./User";
import Group from "./Group";
import TaskReminder from "./TaskReminder";


@Entity()
class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "text" })
    description: string

    @Column({ type: "enum", enum: ["to_do", "in_progress", "completed","stuck"], default: "to_do" })
    status: "to_do" | "in_progress" | "completed" | "stuck"

    @Column({ type: "enum", enum: ["low" , "medium" , "high"], default: "medium" })
    priorityLevel: "low" | "medium" | "high"

    @ManyToOne(() => User, (user) => user.tasks)
    user: Relation<User>

    @Column({ type: "timestamptz" })
    dueDate: Date

    @ManyToOne(() => Group, (group) => group.tasks, {onDelete: 'CASCADE'})
    group: Relation<Group>

    @OneToOne(() => TaskReminder, (reminder) => reminder.task)
    reminder: Relation<TaskReminder>

    @CreateDateColumn()
    createdAt: Date
}

export default Task