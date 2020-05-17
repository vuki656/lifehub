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

export const IsCompletedOptions: any = {
    default: false,
}

export const TaskCardIdOptions: any = {
    type: 'varchar',
}
