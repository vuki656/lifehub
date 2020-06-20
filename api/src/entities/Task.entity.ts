import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { MetaDataEntity } from './MetaData.entity'

@Entity('task')
export class TaskEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'date' })
    date: Date

    @Column({
        name: 'is_completed',
        nullable: false,
        type: 'boolean',
    })
    isCompleted: boolean

    @ManyToOne(() => MetaDataEntity, (metaData) => metaData.tasks)
    metaData: MetaDataEntity

}
