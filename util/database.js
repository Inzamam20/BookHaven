/* eslint-disable prettier/prettier */
const mySQL = require('mysql2');
// require('dotenv').config();

// Connect to PlanetScale Database
// const connection = mySQL.createConnection(process.env.DATABASE_URL);

// Connect to local MySQL Workbench
// create the connection to database

const {
 HOST, USER, PASSWORD, DATABASE,
} = process.env;

// Using Connection Pool
// improves the latency of queries as you avoid all of the
// overhead that comes with establishing a new connection

// The pool does not create all connections upfront but creates
// them on demand until the connection limit is reached

const connection = mySQL.createPool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

// const connection = mySQL.createConnection({
//     host: HOST,
//     user: USER,
//     password: PASSWORD,
//     database: DATABASE,
// });

module.exports = connection;
