import {
    AuthenticationError,
    UserInputError,
} from 'apollo-server'
import { compare } from 'bcryptjs'
import {
    sign,
    verify,
} from 'jsonwebtoken'
import { Service } from 'typedi'
import {
    EntityRepository,
    Repository,
} from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import isEmail from 'validator/lib/isEmail'

import { ContextType } from '../../../global/types/context.type'
import { UserEntity } from '../../entities'

import { LogInUserInput } from './mutations/inputs'
import { RegisterUserInput } from './mutations/inputs/RegisterUser.input'
import {
    LogInUserPayload,
    RegisterUserPayload,
} from './mutations/payloads'
import { RegisterErrors } from './types/RegisterError.type'

@EntityRepository()
@Service({ global: true })
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>,
    ) {
    }

    public async logIn(
        input: LogInUserInput,
        context: ContextType,
    ): Promise<LogInUserPayload> {
        const { secret } = context

        const user = await this.repository.findOne({ where: { email: input.email } })
        if (!user) throw new UserInputError('Error', { email: 'Wrong email.' })

        const isPasswordValid = await compare(input.password, user.password)
        if (!isPasswordValid) throw new UserInputError('Error', { password: 'Wrong password.' })

        const token = sign({ username: user?.username }, secret, { expiresIn: '7 days' })

        return new LogInUserPayload(user, token)
    }

    public async register(
        input: RegisterUserInput,
        context: ContextType,
    ): Promise<RegisterUserPayload> {
        const { secret } = context

        const {
            username,
            email,
            password,
            passwordConfirmation,
        } = input

        const emailExists = this.repository.findOne({ where: { email } })
        const usernameExists = this.repository.findOne({ where: { username } })

        const errors: RegisterErrors = {}

        if (usernameExists) {
            errors.username = 'Username already in use.'
        }

        if (emailExists) {
            errors.email = 'Email already in use.'
        }

        if (!isEmail(email)) {
            errors.email = 'Email must be a valid email address.'
        }

        if (password !== passwordConfirmation) {
            errors.password = 'Passwords must match.'
        }

        if (Object.keys(errors).length > 0) throw new UserInputError('Error', errors)

        const createdUser = await this.repository.save({ ...input })

        const token = sign({ username: createdUser.username }, secret, { expiresIn: '7 days' })

        return new RegisterUserPayload(createdUser, token)
    }

    public async verify(token: string, context: ContextType): Promise<boolean> {
        const { secret } = context

        if (!token) {
            throw new AuthenticationError('Authentication Failed')
        }

        await verify(token, secret, (error) => {
            if (error) throw new AuthenticationError('Authentication Failed')
        })

        return true
    }

}
