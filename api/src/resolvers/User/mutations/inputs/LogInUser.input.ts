import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class LogInUserInput {

    @Field()
    public email: string

    @Field()
    public password: string

}
