import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from '../user'

import { TitleOptions } from './Task.options'

@Entity('task')
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(TitleOptions)
    title: string

    @ManyToOne(() => UserEntity, user => user.tasks, { cascade: true })
    @JoinColumn({ name: 'userId' })
    userId: UserEntity
}
