import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { CardEntity } from './Card.entity'
import { ReminderEntity } from './Reminder.entity'

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 100,
        type: 'varchar',
        unique: true,
    })
    username: string

    @Column({
        length: 240,
        type: 'varchar',
        unique: true,
    })
    email: string

    @Column({
        length: 255,
        type: 'varchar',
    })
    password: string

    @OneToMany(() => ReminderEntity, (reminder) => reminder.user)
    reminders: ReminderEntity[]

    @OneToMany(() => CardEntity, (card) => card.user)
    cards: CardEntity[]

}
