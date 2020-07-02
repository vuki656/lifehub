import dotenv from 'dotenv'
import 'reflect-metadata'

import {
    createDatabaseConnection,
    startServer,
} from './server'

dotenv.config()

createDatabaseConnection()
    .then(() => startServer())
    .catch(() => {
        console.log('===== FAILED =====')
    })
