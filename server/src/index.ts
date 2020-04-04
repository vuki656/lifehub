require('dotenv').config()
import 'reflect-metadata'
import { startGQLServer } from './graphql'
import { createTypeORMConnection } from './typeorm'

createTypeORMConnection()
    .then(() => startGQLServer())
    .catch((error) => {
        console.log('===== FAILED =====')
        console.error(error)
    })
