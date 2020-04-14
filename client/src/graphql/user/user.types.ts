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

export type verifyUserResponse = {
    verifyUser: AuthResponse,
}

export type verifyUserVariables = {
    token: string,
}

export type UserAuth = {
    token: string,
}

export type AuthResponse = {
    isUserAuthenticated: boolean,
    username: string,
}
