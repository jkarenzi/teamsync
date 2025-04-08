import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Relation } from "typeorm";
import User from "./User";
import Group from "./Group";

@Entity()
class PeerAssessment {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, (user) => user.receivedPeerAssessments)
    receiver: Relation<User>

    @ManyToOne(() => User, (user) => user.givenPeerAssessments)
    giver: Relation<User>

    @ManyToOne(() => Group, (group) => group.peerAssessments, {onDelete: 'CASCADE'})
    group: Relation<Group>

    @Column({ type: "int" })
    score: number

    @Column("text", { nullable: true })
    feedback: string

    @CreateDateColumn()
    createdAt: Date
}

export default PeerAssessment