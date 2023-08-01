
require('dotenv').config()
const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DATABASEUSER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE
})

module.exports = pool