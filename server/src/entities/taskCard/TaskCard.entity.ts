import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { TaskEntity } from '../task'

import { UserEntity } from '../user'
import { TitleOptions } from './TaskCard.options'

@Entity('taskCard')
@Unique(['name'])
export class TaskCardEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(TitleOptions)
    name: string

    @OneToMany(() => TaskEntity, task => task.taskCardId)
    tasks: TaskEntity[]

    @ManyToOne(() => UserEntity, user => user.taskCards, { cascade: true })
    @JoinColumn({ name: 'userId' })
    userId: UserEntity
}
