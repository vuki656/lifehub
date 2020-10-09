import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class ToggleTaskInput {

    @Field()
    taskId: string

    @Field()
    isCompleted: boolean

}
