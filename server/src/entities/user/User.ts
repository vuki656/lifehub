import * as bcrypt from 'bcryptjs'
import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { EmailOptions, IdOptions, UsernameOptions } from './Users.options'

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn(IdOptions)
    id: string

    @Column(UsernameOptions)
    username: string

    @Column(EmailOptions)
    email: string

    @Column()
    password: string

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    @BeforeInsert()
    emailToLowercase() {
        this.email = (this.email).toLowerCase()
    }
}
