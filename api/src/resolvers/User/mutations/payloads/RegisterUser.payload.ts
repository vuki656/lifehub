import {
    Field,
    ObjectType,
} from 'type-graphql'

import { UserType } from '../../User.type'

@ObjectType()
export class RegisterUserPayload {

    @Field()
    public token: string

    @Field()
    public user: UserType

    constructor(
        user: UserType,
        token: string,
    ) {
        this.token = token
        this.user = user
    }

}
