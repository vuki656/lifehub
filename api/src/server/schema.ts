import { GraphQLSchema } from 'graphql'
import { GraphQLDate } from 'graphql-iso-date'
import { buildSchemaSync } from 'type-graphql'
import { Container } from 'typedi'

import {
    CardResolver,
    ReminderResolver,
    UserResolver,
} from '../resolvers'

import { authChecker } from './authorization'

export const getSchema = (): GraphQLSchema => {
    return buildSchemaSync({
        authChecker: authChecker,
        container: Container,
        resolvers: [
            UserResolver,
            ReminderResolver,
            CardResolver,
        ], // TODO: IMPORT FROM ONE
        scalarsMap: [{
            scalar: GraphQLDate,
            type: Date,
        }], // TODO: extract to file
        validate: false,
    })
}
