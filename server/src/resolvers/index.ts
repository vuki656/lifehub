import { reminderResolver } from './Reminder/reminder.resolver'
import { userResolver } from './User/user.resolver'

const { GraphQLDateTime } = require('graphql-iso-date')

export const resolvers = [{ GraphQLDateTime }, userResolver, reminderResolver]
