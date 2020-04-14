export interface RegisterErrors extends UserInput {
    username?: string,
}

export type UserInput = {
    password?: string,
    email?: string,
}
