import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'
import { UserEntity } from '../entities/user'
import { validateInput } from '../helpers/validators'

export const userResolver = {
    Query: {
        getAllUsers: () => {
            return getRepository(UserEntity).find()
        },
    },

    Mutation: {
        createUser: async (parent, input) => {
            const { username, email, password, passwordConfirmation } = input

            // Validate user data
            const { valid, errors } = validateInput(username, email, password, passwordConfirmation)
            console.log(valid)
            console.log(errors)
            if (!valid) throw new UserInputError('Errors', { errors })

            if (await UserEntity.findOne({ username })) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken',
                    },
                })
            }

            const user = new UserEntity()

            user.username = username
            user.email = email
            user.password = password

            return getRepository(UserEntity).save(user)
        },
    },
}
