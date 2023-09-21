// To parse Data from HTML files body we need to use body-parser
// and set the urlencoded to false
const bcrypt = require('bcrypt');
const { response } = require('express');
const passport = require('passport');
const passChecker = require('../passwordStrengthChecker');
const connection = require('../util/database');
const { connect } = require('../Routes/indexRoutes.routes');

const getLogin = (req, res) => {
    res.render('./users/login.ejs', { errors: req.flash('errors') });
};

const postLogin = (req, res, next) => {
    // const { Email, password } = req.body;
    // console.log(Email);
    // console.log(password);

    const errors = [];
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            throw err;
        }
        if (!user) {
            // console.log(user);
            if (info.message === 'Incorrect Password!') {
                errors.push(info.message);
                // req.flash('errors', errors);
                // res.redirect('login');
                // res.send('Incorrect Password!');
            } else {
                errors.push('No user Exist with this Email ID');
                // req.flash('errors', errors);
                // res.redirect('login');
                // res.send('No user Exist');
            }
            req.flash('errors', errors);
            res.redirect('login');
        }
        if (user) {
            req.login(user, (error) => {
                if (error) {
                    throw error;
                }
                res.redirect('/');
                // res.rend('User logged in!');
                // console.log(user);
            });
        }
    })(req, res, next);
};

const getRegister = (req, res) => {
    res.render('./users/signup.ejs', { errors: req.flash('errors') });
};

const postRegister = (req, res) => {
    // eslint-disable-next-line object-curly-newline
    const { name, Email, password, confirmPassword } = req.body;

    // Data Validation
    const errors = [];

    if (password) {
        if (password !== confirmPassword) {
            // eslint-disable-next-line eqeqeq
            errors.push('Passwords do not match!');
        }
    }
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters!');
    }
    if (!passChecker.containsSpecialChars(password)) {
        errors.push("Password doesn't contain any special characters");
    }
    if (!name || !Email || !password || !confirmPassword) {
        errors.push('All fields are required!');
    }
    if (errors.length > 0) {
        req.flash('errors', errors); // Redirecting Error to the ejs
        // console.log(errors);
        res.redirect('signup');
    } else {
        // Create New User
        connection.execute(
            'SELECT * FROM user_info WHERE email = ?',
            [Email],

            (error, results) => {
                if (error) {
                    console.log(`An error occured: ${error.message}`);
                    console.log('An error occured in the database');
                    errors.push(error.message);
                    req.flash('errors', errors);
                    res.redirect('signup');
                    // results
                    //     .status(500)
                    //     .json({ status: 500, message: `An error occured: ${error.message}` });
                } else if (results.length) {
                    errors.push('User already exist with this Email');
                    req.flash('errors', errors);
                    res.redirect('signup');
                    // res.status(200).json({ status: 200, message: 'User found successfully.' });
                } else {
                    // lets create the new account
                    // first we generate a salt using bcrypt - salt is basically a random string
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            errors.push(err.message);
                            req.flash('errors', errors);
                            res.redirect('signup');
                        } else {
                            bcrypt.hash(password, salt, (errr, hash) => {
                                if (errr) {
                                    errors.push(errr.message);
                                    req.flash('errors', errors);
                                    res.redirect('signup');
                                } else {
                                    connection.query(
                                        'INSERT INTO user_info VALUES (?, ?, ?)',

                                        [name, Email, hash],
                                        (er) => {
                                            // console.log(result);
                                            if (er) {
                                                console.log(er);
                                            }
                                            console.log('User Created Successfully');
                                            errors.push('Account Created Successfully!');
                                            req.flash('errors', errors);
                                            res.redirect('signup');
                                            // console.log(er);
                                        },
                                    );
                                }
                            });
                        }
                    });
                }
            },
        );
    }
};

module.exports = {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
};
