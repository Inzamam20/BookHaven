/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');

// const isLoggedIn = require('../middlewares/users.middlewares');
const middleWares = require('../middlewares/users.middlewares');
const {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    getDashboard,
    getHomePage,
} = require('../controllers/users.controller');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/login', getLogin);
// router.post('/login', postLogin);
// router.post('/login', middleWares.isLoggedIn, postLogin);

router.get('/signup', getRegister);
// router.post('register', postRegister);
// router.post('/signup', middleWares.alreadyMember, postRegister);

// router.get('/dashboard', getDashboard);
// router.get('/', getHomePage);

module.exports = router;
