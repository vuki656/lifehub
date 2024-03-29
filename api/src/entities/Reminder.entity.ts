import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { UserEntity } from './User.entity'

@Entity('reminder')
export class ReminderEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 55,
        type: 'varchar',
    })
    title: string

    @Column({
        length: 2000,
        nullable: true,
        type: 'varchar',
    })
    note: string

    @Column({
        name: 'due_date',
        type: 'date',
    })
    dueDate: Date

    @ManyToOne(() => UserEntity, (user) => user.reminders, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity

}
