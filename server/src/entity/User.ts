import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

const bcrypt = require('bcrypt')

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        this.password = await bcrypt.hash(this.password, 10)
    }
}
