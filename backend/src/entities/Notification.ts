import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Column,
    Relation,
} from 'typeorm';
import dotenv from 'dotenv'
import User from './User';
dotenv.config()

  
@Entity()
export default class Notification {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, (user) => user.notifications)
    user!: Relation<User>

    @Column('text')
    message!: string

    @Column('boolean', {default: false})
    read!: boolean
    
    @CreateDateColumn({type:'timestamptz'})
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}