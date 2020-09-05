import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

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

}
