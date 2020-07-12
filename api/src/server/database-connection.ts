import { Container } from 'typedi'
import {
    Connection,
    ConnectionOptions,
    createConnection,
    useContainer,
} from 'typeorm'

import {
    CardEntity,
    MetaDataEntity,
    ReminderEntity,
    TaskEntity,
    UserEntity,
} from '../entities'

// Register global container for dependency injection
useContainer(Container)

export const createDatabaseConnection = (): Promise<Connection> => {
    return createConnection({
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        logging: process.env.DB_LOGGING,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL,
        synchronize: process.env.DB_SYNCHRONIZE,
        type: process.env.DB_TYPE,
        username: process.env.DB_USERNAME,

        // eslint-disable-next-line sort-keys
        entities: [UserEntity, ReminderEntity, CardEntity, MetaDataEntity, TaskEntity], // TODO: fix
    } as ConnectionOptions,
    )
}
