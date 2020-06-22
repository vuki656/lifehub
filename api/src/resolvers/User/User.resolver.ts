import {
    Args,
    Ctx,
    Mutation,
    Resolver,
} from 'type-graphql'

import { ContextType } from '../../../global/types/context.type'
import { LogInUserArgs } from './mutations/args'
import { LogInUserMutationPayload } from './mutations/payloads'

import { UserService } from './User.service'
import { UserType } from './User.type'

@Resolver(() => UserType)
export class UserResolver {

    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Mutation(() => LogInUserMutationPayload)
    public async logIn(
        @Args() args: LogInUserArgs,
        @Ctx() context: ContextType,
    ): Promise<LogInUserMutationPayload> {
        return this.userService.logInUser(args, context)
    }

}
