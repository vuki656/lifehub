import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

import { UserEntity } from '../user'
import { TitleOptions } from './TaskCard.options'

@Entity('taskCard')
@Unique(['name'])
export class TaskCardEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(TitleOptions)
    name: string

    @ManyToOne(() => UserEntity, user => user.tasks, { cascade: true })
    @JoinColumn({ name: 'userId' })
    userId: UserEntity
}
