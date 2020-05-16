import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { TaskCardEntity } from '../taskCard'
import { TaskMetaDataEntity } from '../taskMetaData'
import { CheckedOptions, NoteOptions, TaskCardIdOptions, TitleOptions } from './Task.options'

@Entity('task')
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(TitleOptions)
    title: string

    @Column(NoteOptions)
    note: string

    @Column(CheckedOptions)
    checked: boolean

    @ManyToOne(() => TaskMetaDataEntity, taskMetaData => taskMetaData.tasks)
    metaData: TaskMetaDataEntity

    @Column(TaskCardIdOptions)
    @ManyToOne(() => TaskCardEntity, taskCard => taskCard.tasks, { cascade: true })
    @JoinColumn({ name: 'taskCardId' })
    taskCardId: TaskCardEntity
}
