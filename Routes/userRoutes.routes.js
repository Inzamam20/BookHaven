/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

const upload = require('../util/multer');

// const bodyParser = require('body-parser');

// const isLoggedIn = require('../middlewares/users.middlewares');

const {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    signOut,
} = require('../controllers/users.controller');

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());

// router.post('/login', postLogin);
// router.post(
//     '/login/password',
//     passport.authenticate('local', {
//         successRedirect: '/',
//         failureRedirect: '/users/login',
//     })
// );
// router.post('/login', middleWares.isLoggedIn, postLogin);

router.get('/login', getLogin);

router.get('/signup', getSignup);

router.post('/login', postLogin);

router.post('/signup', upload.single('profilePicture'), postSignup);

router.delete('/signout', signOut);

// router.post('/signup', middleWares.alreadyMember, postRegister);

module.exports = router;
