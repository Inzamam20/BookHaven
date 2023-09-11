/* eslint-disable prettier/prettier */
const mySQL = require('mysql2');
require('dotenv').config();

// Connect to PlanetScale Database
// const connection = mySQL.createConnection(process.env.DATABASE_URL);

// Connect to local MySQL Workbench
// create the connection to database

const {
 HOST, USER, PASSWORD, DATABASE,
} = process.env;

const connection = mySQL.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
});

module.exports = connection;
