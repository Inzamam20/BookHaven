/* eslint-disable comma-dangle */
require('dotenv').config();
const express = require('express');

const app = express();

const session = require('express-session');
const flash = require('connect-flash');

const morgan = require('morgan');

// Static Resources
app.use(express.static('public'));

// View Engine
app.set('view engine', 'ejs');

// Session and Flash
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

app.use(flash());

// Body parser
// To parse Data from HTML files body we need to use body-parser
// and set the urlencoded to false
app.use(express.urlencoded({ extended: false }));

// Routes
const userRoutes = require('./Routes/userRoutes.routes');
const indexRoutes = require('./Routes/indexRoutes.routes');

app.use(indexRoutes);
app.use('/users', userRoutes);

// eslint-disable-next-line no-unused-vars
const { logger, printSomething } = require('./middlewares/app.middlewares');

app.use(morgan('tiny'));

// Test the Database Connection
const connection = require('./util/database');

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL database:', error);
    } else {
        console.log('Connected to MySQL database!');
    }
});
// app.get('/getMysqlStatus', (req, res) => {
//     connection.ping((err) => {
//         if (err) {
//             res.status(500).send('MySQL Server is Down');
//         }

//         res.send('<h1>MySQL Server is Active</h1>');
//     });
// });

module.exports = app;
