import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { TaskCardEntity } from '../taskCard'
import { TaskMetaDataEntity } from '../taskMetaData'
import { DateOptions, IsCompletedOptions } from './Task.options'

@Entity('task')
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(DateOptions)
    date: Date

    @Column(IsCompletedOptions)
    isCompleted: boolean

    @ManyToOne(() => TaskMetaDataEntity, taskMetaData => taskMetaData.tasks, { cascade: true })
    @JoinColumn({ name: 'taskMetaData' })
    taskMetaData: TaskMetaDataEntity

    @ManyToOne(() => TaskCardEntity, taskCard => taskCard.tasks, { cascade: true })
    @JoinColumn({ name: 'taskCard' })
    taskCard: TaskCardEntity
}
