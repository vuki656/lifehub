module.exports = {
    databaseConnection: {
        database: process.env.DB_DATABASE,
        entities: process.env.DB_ENTITIES_DIR,
        host: process.env.DB_HOST,
        logging: process.env.DB_LOGGING,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL,
        synchronize: process.env.DB_SYNCHRONIZE,
        type: process.env.DB_TYPE,
        username: process.env.DB_USERNAME,
    },
}
