import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql'

import { ContextType } from '../../../global/types/context.type'
import { LogInUserInput } from './mutations/inputs'
import { RegisterUserInput } from './mutations/inputs/RegisterUser.input'
import {
    LogInUserPayload,
    RegisterUserPayload,
} from './mutations/payloads'

import { UserService } from './User.service'
import { UserType } from './User.type'

@Resolver(() => UserType)
export class UserResolver {

    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Mutation(() => LogInUserPayload)
    public async logInUser(
        @Arg('input') input: LogInUserInput,
        @Ctx() context: ContextType,
    ): Promise<LogInUserPayload> {
        return this.userService.logIn(input, context)
    }

    @Mutation(() => RegisterUserPayload)
    public async registerUser(
        @Arg('input') input: RegisterUserInput,
        @Ctx() context: ContextType,
    ): Promise<RegisterUserPayload> {
        return this.userService.register(input, context)
    }

    @Query()
    public async verifyUser(
        @Arg('token') token: string,
        @Ctx() context: ContextType,
    ): Promise<void> {
        return this.userService.verify(token, context)
    }

}
