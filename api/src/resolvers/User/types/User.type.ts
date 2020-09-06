import {
    Field,
    ObjectType,
} from 'type-graphql'

@ObjectType()
export class UserType {

    @Field()
    public id: string

    @Field()
    public username: string

    @Field()
    public email: string

    constructor(user: UserType) {
        this.id = user.id
        this.username = user.username
        this.email = user.email
    }

}
