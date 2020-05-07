import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { DateOptions, TaskEntity } from '../task'
import { IsCheckedOptions } from './RepeatingTaskInstance.options'

@Entity('repeatingTaskInstance')
export class RepeatingTaskInstanceEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(DateOptions)
    date: Date

    @Column(IsCheckedOptions)
    isChecked: boolean

    @ManyToOne(() => TaskEntity, task => task.repeatingTaskInstances, { cascade: true })
    @JoinColumn({ name: 'taskId' })
    taskId: TaskEntity
}
