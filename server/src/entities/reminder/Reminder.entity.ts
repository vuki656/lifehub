import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { UserEntity } from '../user'
import { DescriptionOptions, EndOptions, StartOptions, TitleOptions } from './Reminder.options'

@Entity('reminders')
export class ReminderEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(TitleOptions)
    title: string

    @Column(DescriptionOptions)
    description: string

    @Column(StartOptions)
    startDate: Date

    @Column(EndOptions)
    endDate: Date

    @ManyToOne(() => UserEntity, user => user.reminders, { cascade: true })
    user: UserEntity
}
