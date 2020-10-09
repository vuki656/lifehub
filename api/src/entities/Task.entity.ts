import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { CardEntity } from './Card.entity'

@Entity('task')
export class TaskEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 150,
        type: 'varchar',
    })
    title: string

    @Column({
        length: 2000,
        nullable: true,
        type: 'varchar',
    })
    note: string

    @Column({
        nullable: false,
        type: 'date',
    })
    date: Date

    @Column({
        default: false,
        name: 'is_completed',
        nullable: false,
        type: 'boolean',
    })
    isCompleted: boolean

    @ManyToOne(() => CardEntity, (card) => card.tasks)
    card: CardEntity

}
