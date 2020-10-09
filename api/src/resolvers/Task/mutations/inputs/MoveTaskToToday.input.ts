import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class MoveTaskToTodayInput {

    @Field()
    id: string

}
