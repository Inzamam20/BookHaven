/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable comma-dangle */
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const multer = require('multer');
const morgan = require('morgan');
const passport = require('passport');

require('dotenv').config();

// Initializing Express App
const app = express();

// Static Resources
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/assets', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/font', express.static(path.join(__dirname, 'node_modules', 'bootstrap-icons', 'font')));

app.use(
    session({
        secret: 'SecretStringForSession',
        cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 Hours
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
// Body parser
// To parse Data from HTML files body we need to use body-parser
// and set the urlencoded to false

// To handle nested objects data extended: true
app.use(express.urlencoded({ extended: false }));
// app.use(express.json()); // use either one

// Set Cookie Parse, Sessions & Flash
app.use(cookieParser());

app.use(flash());

// View Engine - all the view should be saved in a folder called "views"
app.set('view engine', 'ejs');

// Routes
const userRoutes = require('./Routes/userRoutes.routes');
const indexRoutes = require('./Routes/indexRoutes.routes');
const adminRoutes = require('./Routes/adminRoutes.routes');

app.use(indexRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use(morgan('tiny'));
require('./util/passport')(passport);

// Test the Database Connection
const connection = require('./util/database');

const logger = (req, res, next) => {
    console.log(
        `${new Date(Date.now()).toLocaleString()} - ${req.method} - ${req.originalUrl} - ${
            req.protocol
        } - ${req.ip}`
    );
    next();
};

app.use(logger);

// Acquiring a connection from the pool
connection.getConnection((err, conn) => {
    if (err) {
        console.log('Error connecting to MySQL Database!');
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database!');
        console.log();
        conn.release();
    }

    // conn.ping((er) => {
    //     if (!er) {
    //         console.log('MySQL server is activated!');
    //     }
    // });
});

// Test connection while creating only one Connection
// connection.connect((error) => {
//     if (error) {
//         console.error('Error connecting to MySQL database:', error);
//     } else {
//         console.log('Connected to MySQL database!');
//     }
// });

// 404 Error Handler

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    res.status(404).render('invalidURL');
    // next('Requested URL was not found!');
});

// Overwriting Default Error Handling Middleware
app.use((error, req, res, next) => {
    console.log(error);
    if (error instanceof multer.MulterError) {
        res.status(500).send(
            "There was an upload Error! maybe the name field doesn't match with provided name"
        );
    } else if (res.headersSent) {
        next('There was a problem ending the response!');
    } else if (error.message) {
        res.status(500).send(error.message);
    } else {
        res.status(500).render('redirect');
    }
});

module.exports = app;
