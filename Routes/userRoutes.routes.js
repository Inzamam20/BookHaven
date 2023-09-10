/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
// const isLoggedIn = require('../middlewares/users.middlewares');
const middleWares = require('../middlewares/users.middlewares');
const {
    getRegister,
    postRegister,
    getLogin,
    getDashboard,
    getHomePage,
} = require('../controllers/userController.controllers');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/login', getLogin);

router.get('/dashboard', getDashboard);

router.get('/register', getRegister);

router.get('/', getHomePage);

router.post('/login', middleWares.isLoggedIn, (req, res) => {
    res.redirect('/dashboard');
});

router.post('/login', (req, res) => {
    const { Email, password } = req.body;
    res.send(
        // eslint-disable-next-line prettier/prettier
        `<h3>user with Email -${Email} and Password - ${password} is requesting to access</h3>`,
    );
});

router.post('/register', middleWares.alreadyMember, postRegister);

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    res.send(
        `<h2>user with ${username}\n Email: ${email}\n Password: ${password}\n  is trying to create an account`
    );
});

module.exports = router;
