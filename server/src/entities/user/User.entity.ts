import * as bcrypt from 'bcryptjs'
import {
    BaseEntity,
    BeforeInsert,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { ReminderEntity } from '../reminder'
import { TaskCardEntity } from '../taskCard'

import {
    EmailOptions,
    PasswordOptions,
    UsernameOptions,
} from './Users.options'

@Entity('user')
export class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(UsernameOptions)
    username: string

    @Column(EmailOptions)
    email: string

    @Column(PasswordOptions)
    password: string

    @OneToMany(() => ReminderEntity, (reminder) => reminder.user)
    reminders: ReminderEntity[]

    @OneToMany(() => TaskCardEntity, (taskCard) => taskCard.userId)
    taskCards: TaskCardEntity[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    @BeforeInsert()
    emailToLowercase() {
        this.email = (this.email).toLowerCase()
    }

}
