export type UserAuth = {
    token: string,
}

// ** VARIABLES **
export type createUserVariables = {
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
}

export type logInUserVariables = {
    email: string,
    password: string,
}

export type verifyUserVariables = {
    token: string,
}

// ** RESPONSES **
export type createUserResponse = {
    createUser: UserAuth,
}

export type logInUserResponse = {
    logInUser: UserAuth,
}

export type verifyUserResponse = {
    verifyUser: AuthResponse,
}

export type AuthResponse = {
    isUserAuthenticated: boolean,
    username: string,
}
