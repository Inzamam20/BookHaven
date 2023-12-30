/* eslint-disable no-shadow */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
// To parse Data from HTML files body we need to use body-parser
// and set the urlencoded to false
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const fs = require('fs');
const { URL } = require('url');

const path = require('path');
const passChecker = require('../util/passwordStrengthChecker');
const connection = require('../util/database');
const currentUser = require('../util/currentUser/user');

const getLogin = (req, res) => {
    let { alertInfo } = req.cookies;

    if (alertInfo === undefined) {
        alertInfo = 'false';
    }

    res.header('alertInfo', alertInfo);
    res.clearCookie('alertInfo');

    res.render('./users/login.ejs', {
        errorsArray: req.flash('errors'),
        errorAlert: req.flash('alertInfo'),
    });
};

const postLogin = (req, res, next) => {
    const errors = [];
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            throw err;
        }
        if (!user) {
            if (info.message === 'Incorrect Password!') {
                errors.push(info.message);
            } else {
                errors.push('No user exist with this Email ID');
            }

            req.flash('alertInfo', 'true');
            req.flash('errors', errors);
            res.header('errorAlert', 'true');
            res.cookie('alertInfo', 'true');

            res.redirect('login');
        }

        if (user) {
            console.log(user);
            const tokenData = {
                user: user.email,
                lName: user.lastname,
            };

            const token = jwt.sign(tokenData, process.env.JWT_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: '10h',
            });

            req.login(user, (error) => {
                if (error) {
                    throw error;
                }
                currentUser.email = user.email;
                currentUser.name = user.lastName;
                currentUser.profilePicture = user.image.toString('base64');

                res.header('Authorization', `Bearer ${token}`);
                res.cookie('accessToken', token);

                // Check if the request URL starts with "/products"
                if (req.body.origin !== undefined) {
                    const decodedOrigin = decodeURIComponent(req.body.origin);
                    console.log(decodedOrigin);
                    const { pathname } = new URL(decodedOrigin);
                    // console.log(pathname);
                    if (pathname.startsWith('/products')) {
                        console.log(pathname);
                        // Redirect back to the original URL
                        res.redirect(pathname);
                    }
                } else {
                    // Redirecting to Home Page
                    res.redirect('/');
                }
            });
        }
    })(req, res, next);
};

function flashError(req, res, Error) {
    res.set('alertInfo', 'true');
    res.cookie('alertInfo', 'true');

    fs.unlinkSync(req.file.path);

    req.flash('alertInfo', 'true');
    req.flash('errors', Error);
}

const getSignup = (req, res) => {
    let { alertInfo, successInfo } = req.cookies;
    if (alertInfo === undefined) {
        alertInfo = 'false';
    }
    if (successInfo === undefined) {
        successInfo = 'false';
    }

    res.clearCookie('alertInfo');
    res.clearCookie('successInfo');
    res.header('alertInfo', alertInfo);
    res.header('successInfo', successInfo);

    // const errorAlert = req.flash('alertInfo');
    // const errorsArray = req.flash('errors');

    // console.log(errorsArray);

    res.render('./users/signup.ejs', {
        errorAlert: req.flash('alertInfo'),
        successAlert: req.flash('success'),
        errorsArray: req.flash('errors'),
    });
};

const postSignup = (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        dob,
        phoneNo,
        selectedDivision,
    } = req.body;

    // Read the uploaded Profile Picture
    const profilePicture = fs.readFileSync(req.file.path);

    // console.log(req.file.path);

    console.log(dob);

    let division;
    if (selectedDivision === '1') {
        division = 'Dhaka';
    } else if (selectedDivision === '2') {
        division = 'Mymensingh';
    } else if (selectedDivision === '3') {
        division = 'Khulna';
    } else if (selectedDivision === '4') {
        division = 'Rajshahi';
    } else if (selectedDivision === '5') {
        division = 'Rangpur';
    } else if (selectedDivision === '6') {
        division = 'Barishal';
    } else if (selectedDivision === '7') {
        division = 'Chattogram';
    } else if (selectedDivision === '8') {
        division = 'Sylhet';
    }

    const errors = [];

    if (!passChecker.isValidPassword(password)) {
        errors.push(
            'Password should be 8 characters or more with uppercase, lowercase, number, and special character.'
        );
        // flashError(req, res, errors);
        // res.redirect('signup');
    }
    if (password) {
        if (password !== confirmPassword) {
            // eslint-disable-next-line eqeqeq
            errors.push('Passwords do not match!');
        }
    }
    if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !dob ||
        !phoneNo ||
        !selectedDivision
    ) {
        errors.push('All fields are required!');
    }

    if (errors.length > 0) {
        console.log(`${password} -  ${confirmPassword}`);
        console.log(errors);
        flashError(req, res, errors);

        res.redirect('signup');
    } else {
        // Create New User
        connection.execute(
            'SELECT * FROM users WHERE email = ?',

            [email],

            (error, result) => {
                if (error) {
                    console.log(`An error occured: ${error.message}`);
                    console.log('An error occured in the database');
                    errors.push(error.message);
                    flashError(req, res, errors);
                    res.redirect('signup');
                } else if (result.length) {
                    const alertInfo = 'true';

                    console.log('User already exist with this Email');
                    errors.push('User already exist with this Email');

                    res.set('alertInfo', alertInfo);
                    res.cookie('alertInfo', alertInfo);

                    fs.unlinkSync(req.file.path);
                    req.flash('alertInfo', alertInfo);
                    req.flash('errors', errors);

                    res.redirect('signup');
                } else {
                    // Time to create the new Account
                    // Before creating an account we generate a salt using bcrypt
                    // Salt is basically a random string
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            errors.push(err.message);
                            flashError(req, res, errors);

                            res.redirect('signup');
                        } else {
                            bcrypt.hash(password, salt, (errr, hash) => {
                                if (errr) {
                                    errors.push(errr.message);
                                    flashError(req, res, errors);

                                    res.redirect('signup');
                                } else {
                                    connection.query(
                                        'INSERT INTO users (email, password, firstName, lastName, phoneNo, division, image, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',

                                        [
                                            email,
                                            hash,
                                            firstName,
                                            lastName,
                                            phoneNo,
                                            division,
                                            profilePicture,
                                            dob,
                                        ],
                                        (er) => {
                                            // console.log(result);
                                            if (er) {
                                                console.log(`An error occured: ${er.message}`);
                                                flashError(req, res, errors);
                                                res.redirect('signup');
                                            }
                                            const successInfo = 'true';
                                            res.set('successInfo', successInfo);
                                            res.cookie('successInfo', successInfo);

                                            fs.unlinkSync(req.file.path);

                                            console.log('User Created Successfully');
                                            errors.push('Account created Succesfully!');

                                            req.flash('errors', errors);
                                            req.flash('success', successInfo);

                                            res.redirect('signup');
                                        }
                                    );
                                }
                            });
                        }
                    });
                }
            }
        );
    }
};

const signOut = (req, res) => {
    res.clearCookie('accessToken');
    // Send a response indicating successful sign-out
    res.sendStatus(200);
};
module.exports = {
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    signOut,
};
