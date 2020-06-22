import { UserType } from '../../src/resolvers/User'

export type ContextType = {
    token: string,
    secret: string,
    user: UserType,
}
