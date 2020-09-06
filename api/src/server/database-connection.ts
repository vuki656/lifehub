import { Container } from 'typedi'
import {
    Connection,
    ConnectionOptions,
    createConnection,
    useContainer,
} from 'typeorm'

import * as entities from '../entities'

// Register global container for dependency injection
useContainer(Container)

export const createDatabaseConnection = (): Promise<Connection> => {
    return createConnection({
        database: process.env.DB_DATABASE,
        entities: Object.values(entities),
        host: process.env.DB_HOST,
        logging: process.env.DB_LOGGING,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL,
        synchronize: process.env.DB_SYNCHRONIZE,
        type: process.env.DB_TYPE,
        username: process.env.DB_USERNAME,
    } as ConnectionOptions,
    )
}
