import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { UserEntity } from '../../entities/user'
import { emailRegEx } from '../../helpers/variables'
import { UserErrors } from './user.types'

export const userResolver = {
    Query: {
        getAllUsers: () => {
            return getRepository(UserEntity).find()
        },
    },

    Mutation: {
        createUser: async (parent, input) => {
            const { username, email, password, passwordConfirmation } = input
            const errors: UserErrors = {}

            // Check email format
            if (!email.match(emailRegEx)) {
                errors.email = 'Email must be a valid email address'
            }

            // Check if email exists
            if (await UserEntity.findOne({ where: { email } })) {
                errors.email = 'Email already in use'
            }

            // Check if passwords match
            if (password !== passwordConfirmation) {
                errors.password = 'Passwords must match'
            }

            // Check if username exists
            if (await UserEntity.findOne({ where: { username } })) {
                errors.username = 'Username already in use'
            }

            // Throw errors if there are any
            if (Object.keys(errors).length > 0) throw new UserInputError('Error', errors)

            const user = new UserEntity()

            user.username = username
            user.email = email
            user.password = password

            return getRepository(UserEntity).save(user)
        },
    },
}
