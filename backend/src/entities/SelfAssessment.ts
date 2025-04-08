import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Relation } from "typeorm";
import User from "./User";
import Group from "./Group";

@Entity()
class SelfAssessment {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, (user) => user.selfAssessments)
    user: Relation<User>

    @ManyToOne(() => Group, (group) => group.selfAssessments, {onDelete: 'CASCADE'})
    group: Relation<Group>

    @Column({ type: "float" })
    score: number

    @Column("text", { nullable: true })
    feedback: string

    @CreateDateColumn()
    createdAt: Date
}

export default SelfAssessment