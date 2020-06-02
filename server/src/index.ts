import 'reflect-metadata'
import { startGQLServer } from './graphql'
import { createTypeORMConnection } from './typeorm'

require('dotenv').config()

createTypeORMConnection()
.then(() => startGQLServer())
.catch((error) => {
    console.log('===== FAILED =====')
    console.error(error)
})
