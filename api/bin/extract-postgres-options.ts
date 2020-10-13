/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const dotenv = require('dotenv')

/*
 * Initialize dotenv to load .env variables
 * Then log those so they can be accessed in the start-docker-postgres.sh script
 *
 */

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const databasePort = process.env.DB_PORT
const databaseName = process.env.DB_DATABASE
const databaseUsername = process.env.DB_USERNAME
const databasePassword = process.env.DB_PASSWORD

// eslint-disable-next-line no-console
console.log(`
        ${databasePort} 
        ${databaseName} 
        ${databaseUsername}
        ${databasePassword} 
`)
