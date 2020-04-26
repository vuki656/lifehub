import config from 'config'
import { ConnectionOptions, createConnection } from 'typeorm'

export const createTypeORMConnection = () => {
    const {
        type,
        host,
        port,
        username,
        password,
        database,
        synchronize,
        logging,
        ssl,
    } = config.get('databaseConnection')

    return createConnection({
        type,
        host,
        port,
        username,
        password,
        database,
        synchronize,
        logging,
        ssl,

        entities: [__dirname + '/entities/**/*.entity.ts'],
    } as ConnectionOptions)
}
