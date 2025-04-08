import { Entity, PrimaryGeneratedColumn, Column, Relation, OneToOne, JoinColumn } from "typeorm";
import Group from "./Group";


@Entity()
class GithubContributionData {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @OneToOne(() => Group, (group) => group.githubContributionData, {onDelete: 'CASCADE'})
    @JoinColumn()
    group: Relation<Group>

    @Column('jsonb')
    contributorStats: {
        username: string;
        totalCommits: number;
        weeklyData: any[];
    }[]
}

export default GithubContributionData