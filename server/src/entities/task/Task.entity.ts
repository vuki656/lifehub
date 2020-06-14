import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { TaskMetaDataEntity } from '../taskMetaData'

import {
    DateOptions,
    IsCompletedOptions,
} from './Task.options'

@Entity('task')
export class TaskEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(DateOptions)
    date: Date

    @Column(IsCompletedOptions)
    isCompleted: boolean

    @ManyToOne(() => TaskMetaDataEntity, (taskMetaData) => taskMetaData.tasks, { cascade: true })
    @JoinColumn({ name: 'taskMetaData' })
    taskMetaData: TaskMetaDataEntity

}
