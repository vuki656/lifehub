import { UserInputError } from 'apollo-server'
import * as bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { Repository } from 'typeorm'

import { ContextType } from '../../../global/types/context.type'
import { UserEntity } from '../../entities'

import { LogInUserArgs } from './mutations/args'
import { LogInUserMutationPayload } from './mutations/payloads'

export class UserService {

    constructor(
        private readonly repository: Repository<UserEntity>,
    ) {
    }

    public async logInUser(
        args: LogInUserArgs,
        context: ContextType,
    ): Promise<LogInUserMutationPayload> {
        const { secret } = context

        const user = await this.repository.findOne({ where: { email: args.email } })
        if (!user) throw new UserInputError('Error', { email: 'Wrong email.' })

        const isPasswordValid = await bcrypt.compare(args.password, user.password)
        if (!isPasswordValid) throw new UserInputError('Error', { password: 'Wrong password.' })

        const token = sign({ username: user?.username }, secret, { expiresIn: '7 days' })

        return new LogInUserMutationPayload(user, token)
    }

}
