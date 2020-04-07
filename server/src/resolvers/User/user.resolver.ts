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
            !email.match(emailRegEx)
                ? errors.email = 'Email must be a valid email address'
                : errors.email = ''

            // Check if passwords match
            password !== passwordConfirmation
                ? errors.password = 'Passwords must match'
                : errors.password = ''

            // Check if username exists
            await UserEntity.findOne({ username })
                ? errors.username = 'Username already in use'
                : errors.username = ''

            // Check if email exists
            await UserEntity.findOne({ email })
                ? errors.email = 'Email already in use'
                : errors.email = ''

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
