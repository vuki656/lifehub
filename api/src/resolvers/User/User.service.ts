import { UserInputError } from 'apollo-server'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { Service } from 'typedi'
import {
    EntityRepository,
    Repository,
} from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ContextType } from '../../../global/types/context.type'
import { UserEntity } from '../../entities'

import { LogInUserArgs } from './mutations/args'
import { LogInUserMutationPayload } from './mutations/payloads'

@EntityRepository()
@Service({ global: true })
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    public async logIn(
        args: LogInUserArgs,
        context: ContextType,
    ): Promise<LogInUserMutationPayload> {
        const { secret } = context

        const user = await this.userRepository.findOne({ where: { email: args.email } })
        if (!user) throw new UserInputError('Error', { email: 'Wrong email.' })

        const isPasswordValid = await compare(args.password, user.password)
        if (!isPasswordValid) throw new UserInputError('Error', { password: 'Wrong password.' })

        const token = sign({ username: user?.username }, secret, { expiresIn: '7 days' })

        return new LogInUserMutationPayload(user, token)
    }

}
