import { UserInputError } from 'apollo-server'
import * as bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { getRepository } from 'typeorm'
import { UserEntity } from '../../../entities/user'
import { emailRegEx } from '../../../helpers/variables'
import { UserInput } from '../user.types'

export const logInUserHandler = async (input, context) => {
    const { email, password } = input
    const { secret } = context
    const errors: UserInput = {}

    const user = await getRepository(UserEntity).findOne({ where: { email } })
    const isPasswordValid = user && bcrypt.compareSync(password, user.password)

    // Check email format
    if (!email.match(emailRegEx)) {
        errors.email = 'Email must be a valid email address'
    }

    // Check if user exists
    if (!user) {
        errors.email = 'Wrong email'
    }

    // If password invalid throw error
    if (!isPasswordValid) {
        errors.password = 'Wrong password'
    }

    // Throw errors if there are any
    if (Object.keys(errors).length > 0) throw new UserInputError('Error', errors)

    // If password valid and user exists return signed token
    if (isPasswordValid && user) {
        const token = sign({ email: user.email }, secret)
        return { token }
    }
}
