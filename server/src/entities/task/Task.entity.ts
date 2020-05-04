import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { TaskCardEntity } from '../taskCard'
import { DateOptions, NoteOptions, RRuleOptions, TitleOptions } from './Task.options'

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

    @Column()
    checked: boolean

    @Column(RRuleOptions)
    rrule: string

    @Column()
    isRepeating: boolean

    @ManyToOne(() => TaskCardEntity, taskCard => taskCard.tasks, { cascade: true })
    @JoinColumn({ name: 'taskCardId' })
    taskCardId: TaskCardEntity
}
