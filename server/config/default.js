module.exports = {
    databaseConnection: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: process.env.DB_SYNCHRONIZE,
        logging: process.env.DB_LOGGING,
        ssl: process.env.DB_SSL,
        entities: process.env.DB_ENTITIES_DIR
    }
};
