import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { TaskEntity } from '../task'

import { DateOptions, EndDateOptions, IsHabitOptions, IsRepeatingOptions, NextRepeatingInstanceOptions, RRuleOptions } from './TaskMetaData.options'

@Entity('taskMetaData')
export class TaskMetaDataEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(DateOptions)
    date: Date

    @Column(EndDateOptions)
    endDate: Date

    @Column(RRuleOptions)
    rrule: string

    @Column(IsRepeatingOptions)
    isRepeating: boolean

    @Column(IsHabitOptions)
    isHabit: boolean

    @Column(NextRepeatingInstanceOptions)
    nextRepeatingInstance: Date | null // If task repeating, it holds its next instance

    @OneToMany(() => TaskEntity, task => task.metaData)
    tasks: TaskEntity[]
}
