export const TitleOptions: any = {
    length: 150,
    type: 'varchar',
}

export const NoteOptions: any = {
    length: 2000,
    type: 'varchar',
    nullable: true,
}

export const DateOptions: any = {
    type: 'timestamptz',
}

export const EndDateOptions: any = {
    type: 'timestamptz',
    nullable: true,
}

export const RRuleOptions: any = {
    nullable: true,
}
