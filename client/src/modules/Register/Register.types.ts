export type RegisterFormType = {
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
}

export type RegisterFormErrorType = {
    username?: string,
    email?: string,
    password?: string,
}
