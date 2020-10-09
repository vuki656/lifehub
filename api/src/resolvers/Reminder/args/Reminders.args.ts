import {
    Field,
    InputType,
    registerEnumType,
} from 'type-graphql'

export enum RemindersTimeSpanEnum {
    PAST = 'past',
    FUTURE = 'future',
    ALL = 'all',
}

registerEnumType(RemindersTimeSpanEnum, { name: 'RemindersTimeSpanEnum' })

@InputType()
export class RemindersArgs {

    @Field(() => RemindersTimeSpanEnum)
    timeSpan: RemindersTimeSpanEnum

}
