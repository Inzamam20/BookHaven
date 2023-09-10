const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./Routes/userRoutes.routes');

// eslint-disable-next-line no-unused-vars
const { logger, printSomething } = require('./middlewares/app.middlewares');

const app = express();
// const server = require('./http-module');
// server.listen(3000);
// server.server.listen(3000);

// app.use(logger, printSomething); // It was Application Level MiddleWare
// Whenever server is getting any request for any file then the MiddleWare will be called

app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(userRoutes);

// The following code is Raw Node JS where we have to send the respond end message
/*
app.get('/', logger, (req, res) => {
    // res.statusCode(200);
    res.status(200).send('<h2>Home Page</h2>');
    res.end();
});
app.get('/contact', (req, res) => {
    res.status(202).send('<h2>Contact Page</h2>');
    res.end();
});

app.use((req, res) => {
    res.status(401).send("Error 404! Page doesn't exist.");
    // res.send();
});

*/

module.exports = app;
