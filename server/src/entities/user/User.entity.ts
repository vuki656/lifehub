import * as bcrypt from 'bcryptjs'
import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { EmailOptions, PasswordOptions, UsernameOptions } from './Users.options'

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(UsernameOptions)
    username: string

    @Column(EmailOptions)
    email: string

    @Column(PasswordOptions)
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
