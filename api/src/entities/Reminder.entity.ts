import {
    Column,
    Entity,
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

    @Column({ type: 'date' })
    startDate: Date

    @Column({ type: 'date' })
    endDate: Date

    @ManyToOne(() => UserEntity, (user) => user.reminders)
    user: UserEntity

}
