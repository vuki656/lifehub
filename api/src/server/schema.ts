import { GraphQLSchema } from 'graphql'
import { buildSchemaSync } from 'type-graphql'

import { ReminderResolver } from '../resolvers'
import { UserResolver } from '../resolvers/User'

import { authChecker } from './authorization'

export const getSchema = (): GraphQLSchema => {
    return buildSchemaSync({
        authChecker: authChecker,
        resolvers: [UserResolver, ReminderResolver], // IMPORT FROM ONE
    })
}
