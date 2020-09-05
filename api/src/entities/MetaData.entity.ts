import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { TaskEntity } from './Task.entity'

@Entity('task_meta_data')
export class MetaDataEntity extends BaseEntity {

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
        nullable: true,
        type: 'date',
    })
    startDate: Date | null

    @Column({
        nullable: true,
        type: 'date',
    })
    endDate: Date | null

    @Column({
        nullable: true,
        type: 'text',
    })
    rrule: string | null

    @Column({
        default: false,
        type: 'boolean',
    })
    isRepeating: boolean

    @Column({
        default: false,
        type: 'boolean',
    })
    isHabit: boolean

    @Column({
        nullable: true,
        type: 'date',
    })
    nextRepeatingInstance: Date | null

    @OneToMany(() => TaskEntity, (task) => task.metaData)
    tasks: TaskEntity[]

}
