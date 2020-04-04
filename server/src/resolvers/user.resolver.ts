import { getRepository } from 'typeorm'
import { UserEntity } from '../entities/user'

export const userResolver = {
    Query: {
        getUsers: () => {
            return getRepository(UserEntity).find()
        },
    },

    Mutation: {
        addUser: (parent, input) => {
            const { id, username, email, password } = input
            const user = new UserEntity()

            user.id = id
            user.username = username
            user.email = email
            user.password = password

            return getRepository(UserEntity).save(user)
        },
    },
}
