/* eslint-disable comma-dangle */
require('dotenv').config();
const express = require('express');

const app = express();

const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
// const mySQL = require('mysql2');

// Static Resources
app.use(express.static('public'));

// View Engine
app.set('view engine', 'ejs');

// Routes
const userRoutes = require('./Routes/userRoutes.routes');
const indexRoutes = require('./Routes/indexRoutes.routes');

app.use(indexRoutes);
app.use('/users', userRoutes);

// eslint-disable-next-line no-unused-vars
const { logger, printSomething } = require('./middlewares/app.middlewares');
// Connect to PlanetScale Database
// const connection = mySQL.createConnection(process.env.DATABASE_URL);

// Session and Flash
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

app.use(flash());

app.use(morgan('tiny'));

// app.get('/getMysqlStatus', (req, res) => {
//     connection.ping((err) => {
//         if (err) {
//             res.status(500).send('MySQL Server is Down');
//         }

//         res.send('<h1>MySQL Server is Active</h1>');
//     });
// });

module.exports = app;
