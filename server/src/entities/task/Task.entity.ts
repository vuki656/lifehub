import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { RepeatingTaskInstanceEntity } from '../repeatingTaskInstance'

import { TaskCardEntity } from '../taskCard'
import {
    CheckedOptions,
    DateOptions,
    EndDateOptions,
    IsHabitOptions,
    IsRepeatingOptions,
    LastInstanceOptions,
    NoteOptions,
    RRuleOptions,
    TitleOptions,
} from './Task.options'

@Entity('task')
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(TitleOptions)
    title: string

    @Column(NoteOptions)
    note: string

    @Column(DateOptions)
    date: Date

    @Column(EndDateOptions)
    endDate: Date

    @Column(CheckedOptions)
    checked: boolean

    @Column(RRuleOptions)
    rrule: string

    @Column(IsRepeatingOptions)
    isRepeating: boolean

    @Column(IsHabitOptions)
    isHabit: boolean

    @Column(LastInstanceOptions)
    lastRepeatingInstance: Date // If task repeating, it holds its last instance, used for calculating next instances

    @ManyToOne(() => TaskCardEntity, taskCard => taskCard.tasks, { cascade: true })
    @JoinColumn({ name: 'taskCardId' })
    taskCardId: TaskCardEntity

    @OneToMany(() => RepeatingTaskInstanceEntity, repeatingTaskInstance => repeatingTaskInstance.taskId)
    repeatingTaskInstances: RepeatingTaskInstanceEntity[]
}
