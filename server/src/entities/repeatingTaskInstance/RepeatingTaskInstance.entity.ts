import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { TaskEntity } from '../task'

@Entity('repeatingTaskInstance')
export class RepeatingTaskInstanceEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    task: string

    @ManyToOne(() => TaskEntity, task => task.repeatingTaskInstances, { cascade: true })
    @JoinColumn({ name: 'taskId' })
    taskId: TaskEntity
}
