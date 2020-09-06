import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { TaskEntity } from './Task.entity'
import { UserEntity } from './User.entity'

@Entity('card')
export class CardEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 150,
        type: 'varchar',
    })
    name: string

    @ManyToOne(() => UserEntity, (user) => user.cards)
    user: UserEntity

    @OneToMany(() => TaskEntity, (task) => task.card)
    tasks: TaskEntity[]

}
