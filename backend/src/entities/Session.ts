import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation } from "typeorm";
import User from "./User";


@Entity()
class Session {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, (user) => user.sessions)
    user: Relation<User>

    @Column({ type: "timestamptz" })
    loginAt: Date

    @Column({ type: 'timestamptz', nullable: true})
    logoutAt: Date
}

export default Session