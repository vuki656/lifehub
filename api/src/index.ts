import dotenv from 'dotenv'
import 'reflect-metadata'

import {
    createDatabaseConnection,
    startServer,
} from './server'

dotenv.config()

createDatabaseConnection()
    .then(() => startServer())
    .catch((error) => {
        console.log('===== FAILED =====')
        console.log(error)
    })
