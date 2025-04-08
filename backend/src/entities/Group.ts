import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, ManyToOne, Relation, OneToOne} from "typeorm";
import User from "./User";
import Task from "./Task";
import Message from "./Message";
import Assignment from "./Assignment";
import PeerAssessment from "./PeerAssessment";
import SelfAssessment from "./SelfAssessment";
import GithubContributionData from "./GithubContributionData";

@Entity()
class Group {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "text" })
    name: string

    @ManyToMany(() => User, (user) => user.groups)
    users: Relation<User[]>

    @OneToMany(() => Task, (task) => task.group)
    tasks: Relation<Task[]>

    @ManyToOne(() => Assignment, (assignment) => assignment.groups, {onDelete: 'CASCADE'})
    assignment: Relation<Assignment>

    @OneToMany(() => Message, (message) => message.group)
    messages: Relation<Message[]>

    @OneToMany(() => PeerAssessment, (peerAssessment) => peerAssessment.group)
    peerAssessments: Relation<PeerAssessment[]>

    @OneToMany(() => SelfAssessment, (selfAssessment) => selfAssessment.group)
    selfAssessments: Relation<SelfAssessment[]>

    @Column('text',{nullable:true})
    githubRepoName: string

    @Column('text',{nullable:true})
    githubRepoLink: string

    @OneToOne(() => GithubContributionData, (githubContributionData) => githubContributionData.group, {nullable:true})
    githubContributionData: Relation<GithubContributionData>
}

export default Group