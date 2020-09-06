import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class RegisterUserInput {

    @Field()
    public username: string

    @Field()
    public email: string

    @Field()
    public password: string

    @Field()
    public passwordConfirmation: string

}
