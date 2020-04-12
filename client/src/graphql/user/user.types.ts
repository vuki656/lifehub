export type createUserVariables = {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export type createUserResponse = {
    createUser: UserAuth,
}

export type logInUserVariables = {
    email: string,
    password: string,
}

export type logInUserResponse = {
    logInUser: UserAuth,
}

export type UserAuth = {
    token: string,
}
