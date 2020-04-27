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
    start: Date

    @Column(EndOptions)
    end: Date

    @ManyToOne(() => UserEntity, user => user.reminders, { cascade: true })
    user: UserEntity
}
