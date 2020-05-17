export const TitleOptions: any = {
    length: 150,
    type: 'varchar',
}

export const NoteOptions: any = {
    length: 2000,
    type: 'varchar',
    nullable: true,
}

export const StartDateOptions: any = {
    type: 'timestamptz',
    nullable: true,
}

export const EndDateOptions: any = {
    type: 'timestamptz',
    nullable: true,
}

export const RRuleOptions: any = {
    nullable: true,
}

export const IsRepeatingOptions: any = {
    default: false,
}

export const IsHabitOptions: any = {
    default: false,
}

export const NextRepeatingInstanceOptions: any = {
    type: 'timestamptz',
    nullable: true,
}
