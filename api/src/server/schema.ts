import { GraphQLSchema } from 'graphql'
import { buildSchemaSync } from 'type-graphql'
import { Container } from 'typedi'

import { ReminderResolver } from '../resolvers'
import { UserResolver } from '../resolvers/User'

import { authChecker } from './authorization'

export const getSchema = (): GraphQLSchema => {
    return buildSchemaSync({
        authChecker: authChecker,
        container: Container,
        resolvers: [UserResolver, ReminderResolver], // TODO: IMPORT FROM ONE
        validate: false,
    })
}
