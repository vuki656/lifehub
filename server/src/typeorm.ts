import config from 'config'
import {
    ConnectionOptions,
    createConnection,
} from 'typeorm'

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
        database,
        host,
        logging,
        password,
        port,
        ssl,
        synchronize,
        type,
        username,

        // eslint-disable-next-line sort-keys
        entities: [__dirname + '/entities/**/*.entity.ts'],
    } as ConnectionOptions)
}
