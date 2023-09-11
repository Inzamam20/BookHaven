// To parse Data from HTML files body we need to use body-parser
// and set the urlencoded to false
const bcrypt = require('bcrypt');
const { response } = require('express');
const passChecker = require('../passwordStrengthChecker');
const connection = require('../util/database');
const { connect } = require('../Routes/indexRoutes.routes');

const getLogin = (req, res) => {
    res.render('./users/login.ejs');
};

const postLogin = (req, res) => {
    const { Email, password } = req.body;

    console.log(Email);
    console.log(password);
};

const getRegister = (req, res) => {
    res.render('./users/signup.ejs', { errors: req.flash('errors') });
};

const postRegister = (req, res) => {
    // eslint-disable-next-line object-curly-newline
    const { name, Email, password, confirmPassword } = req.body;

    // Data Validation
    const errors = [];
    if (!name || !Email || !password || !confirmPassword) {
        errors.push('All fields are required!');
    }
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters!');
    }
    if (password) {
        if (password != confirmPassword) {
            // eslint-disable-next-line eqeqeq
            errors.push('Passwords do not match!');
        }
    }
    if (!passChecker.containsSpecialChars(password)) {
        errors.push("Password doesn't contain any special characters");
    }
    if (errors.length > 0) {
        req.flash('errors', errors); // Resdirecting Error to the ejs
        // console.log(errors);
        res.redirect('signup');
    } else {
        // Create New User
        connection.execute(
            'SELECT * FROM user_info WHERE email = ?',
            [Email],

            (error, results, fields) => {
                if (error) {
                    console.error(`An error occured: ${error.message}`);
                    console.log('An error occured in the database');
                    errors.push(error.message);
                    req.flash('errors', errors);
                    res.redirect('signup');
                    results
                        .status(500)
                        .json({ status: 500, message: `An error occured: ${error.message}` });
                } else if (results.length) {
                    // console.log('User already exist with this Email!');
                    errors.push('User already exist with this Email');
                    req.flash('errors', errors);
                    res.redirect('signup');
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
                                if (err) {
                                    errors.push(errr.message);
                                    req.flash('errors', errors);
                                    res.redirect('signup');
                                } else {
                                    connection.query(
                                        'INSERT INTO user_info VALUES (?, ?, ?)',

                                        [name, Email, hash],
                                        (er, result) => {
                                            // console.log(result);
                                            console.log('User Created Successfully');
                                            // console.log(err);
                                        },
                                    );
                                }
                            });
                        }
                    });
                }
            }
        );
        // res.redirect('login');
    }
};

module.exports = {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
};
