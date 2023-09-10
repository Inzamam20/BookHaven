/* eslint-disable eqeqeq */
const http = require('http');
// const { type } = require('os');
const file = require('./fs-module');

const server = http.createServer((req, res) => {
    // res.writeHead(200, { 'Content-Type': 'text/plain' }); // Specifying the head manually
    // res.write('<h1>Hello</h1>');
    // res.end();
    if (req.url == '/') {
        // res.writeHead(200, { 'Content-Type': 'text/html' });
        // res.write(file.about);
        res.write('<h1>This is HomePage</h1>');
        res.end();
    } else if (req.url == '/home') {
        // res.write('<h1>This is Base URL</h1>');
        res.writeHead(200, { 'Content-Type': 'text/html' }); // Set the Content-Type to 'text/html'
        res.write(file.contact);
        res.end();
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(file.service);
        res.end();
    }
});

// A response has two parts one is Head and another is Body
// Head containst that what type of data we are sending eg: Image or text or sth
// Body contains the content
// If i dont declare the Head, then Head is automatically declared based on the data
module.exports = { server };
