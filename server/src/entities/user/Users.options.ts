export const IdOptions: any = {
    type: 'uuid',
}

export const UsernameOptions: any = {
    unique: true,
    type: 'varchar',
    precision: 100,
}

export const EmailOptions: any = {
    unique: true,
    type: 'varchar',
    precision: 254,
}
