
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
