import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Relation } from "typeorm";
import User from "./User";
import Group from "./Group";

@Entity()
class Message {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "text" })
    content: string

    @ManyToOne(() => User, (user) => user.messages)
    sender: Relation<User>

    @ManyToOne(() => Group, (group) => group.messages, {onDelete: 'CASCADE'})
    group: Relation<Group>

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date
}

export default Message