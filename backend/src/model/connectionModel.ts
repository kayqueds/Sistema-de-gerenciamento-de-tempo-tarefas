import mysql from 'mysql2/promise'
import {config} from 'dotenv'
config()

// NPM I MYSQL2 --SAVE-DEV
export const connectionModel  =  mysql.createPool({

    host: process.env.HOST || '',
    user: process.env.USER || '',
    password: process.env.PASSWORD || '',
    database: process.env.DATABASE || ''

})

