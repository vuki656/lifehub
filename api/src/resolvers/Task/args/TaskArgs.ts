import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class TaskArgs {

    @Field()
    public id: string

}
