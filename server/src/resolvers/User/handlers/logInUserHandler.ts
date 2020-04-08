import * as bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { UserEntity } from '../../../entities/user'

export const logInUserHandler = async (input, context) => {
    const { email, password } = input
    const { secret } = context

    const user = await getRepository(UserEntity).findOne({ where: { email } })
    const isPasswordValid = user && bcrypt.compareSync(password, user.password)

    // If password valid and user exists return signed token
    if (isPasswordValid && user) {
        const token = sign({ email: user.email }, secret)
        return { token }
    }
}
