import { getRepository } from 'typeorm'
import { User } from '../entities/User'

export const userResolver = {
    Query: {
        getUsers: () => {
            return getRepository(User).findOne()
        },
    },

    Mutation: {
        // this is the addUser resolver
        addUser: (_: any, { id, email, password }: any) => {
            const user = new User()
            user.id = id
            user.email = email
            user.password = password
            return getRepository(User).save(user)
        },
    },
}
