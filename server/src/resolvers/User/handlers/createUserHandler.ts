import { UserInputError } from 'apollo-server'
import { sign } from 'jsonwebtoken'
import { getRepository } from 'typeorm'

import { UserEntity } from '../../../entities/user'
import { emailRegEx } from '../../../util/variables'
import { RegisterErrors } from '../user.types'

export const createUserHandler = async (input, context) => {
    const { username, email, password, passwordConfirmation } = input
    const { secret } = context
    const errors: RegisterErrors = {}

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

    // Save user
    const user = new UserEntity()
    user.username = username
    user.email = email
    user.password = password
    await getRepository(UserEntity).save(user)

    // Return signed token
    const token = sign({ email: user.email }, secret, { expiresIn: '2 days' })
    return { token }
}
