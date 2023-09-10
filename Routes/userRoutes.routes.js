/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const isLoggedIn = require('../middlewares/users.middlewares');
const {
    getRegister,
    postRegister,
    getLogin,
    getDashboard,
} = require('../controllers/userController.controllers');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/login', getLogin);

router.get('/dashboard', getDashboard);

router.post('/login', isLoggedIn, (req, res) => {
    res.redirect('/dashboard');
});

router.post('/login', (req, res) => {
    const { Email, password } = req.body;
    res.send(
        // eslint-disable-next-line prettier/prettier
        `<h3>user with Email -${Email} and Password - ${password} is requesting to access</h3>`,
    );
});

router.get('/register', (req, res) => {
    res.send('This is Register Page');
});

module.exports = router;
