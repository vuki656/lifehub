import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { MetaDataEntity } from './MetaData.entity'
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

    @OneToMany(() => MetaDataEntity, (metaData) => metaData.card)
    metaData: MetaDataEntity

    @ManyToOne(() => UserEntity, (user) => user.cards)
    user: UserEntity

}
