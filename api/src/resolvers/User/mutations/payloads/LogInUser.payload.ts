import {
    Field,
    ObjectType,
} from 'type-graphql'

@ObjectType()
export class LogInUserPayload {

    @Field()
    public token: string

    @Field()
    public userId: string

    constructor(
        userId: string,
        token: string,
    ) {
        this.token = token
        this.userId = userId
    }

}
