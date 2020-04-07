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
            console.log(input)
            const { username, email, password, passwordConfirmation } = input
            const errors: UserErrors = {
                email: '',
                username: '',
                password: '',
            }

            // Check email format
            if (!email.match(emailRegEx)) errors.email = 'Email must be a valid email address'

            // Check if passwords match
            if (password !== passwordConfirmation) errors.password = 'Passwords must match'

            // Check if username exists
            if (await UserEntity.findOne({ username })) errors.username = 'Username already in use'

            // Check if email exists
            if (await UserEntity.findOne({ email })) errors.email = 'Email already in use'

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
