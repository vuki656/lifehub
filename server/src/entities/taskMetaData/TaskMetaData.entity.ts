import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { TaskEntity } from '../task'

import {
    EndDateOptions,
    IsHabitOptions,
    IsRepeatingOptions,
    NextRepeatingInstanceOptions,
    NoteOptions,
    RRuleOptions,
    StartDateOptions,
    TitleOptions,
} from './TaskMetaData.options'

@Entity('taskMetaData')
export class TaskMetaDataEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column(TitleOptions)
    title: string

    @Column(NoteOptions)
    note: string

    @Column(StartDateOptions)
    startDate: Date | null

    @Column(EndDateOptions)
    endDate: Date | null

    @Column(RRuleOptions)
    rrule: string | null

    @Column(IsRepeatingOptions)
    isRepeating: boolean

    @Column(IsHabitOptions)
    isHabit: boolean

    @Column(NextRepeatingInstanceOptions)
    nextRepeatingInstance: Date | null

    @OneToMany(() => TaskEntity, (task) => task.taskMetaData)
    tasks: TaskEntity[]

}
