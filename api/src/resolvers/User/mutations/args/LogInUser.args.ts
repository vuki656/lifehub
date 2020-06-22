import {
    ArgsType,
    Field,
} from 'type-graphql'

@ArgsType()
export class LogInUserArgs {

    @Field()
    public email: string

    @Field()
    public password: string

}
