import { getRepository } from 'typeorm'
import { User } from '../entities/user/User'

export const userResolver = {
    Query: {
        getUsers: () => {
            return getRepository(User).findOne()
        },
    },

    Mutation: {
        // this is the addUser resolver
        addUser: (_: any, { id, email, password, username }: any) => {
            const user = new User()
            user.id = id
            user.username = username
            user.email = email
            user.password = password
            return getRepository(User).save(user)
        },
    },
}
