/* eslint-disable prettier/prettier */
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');

// const passport = require('passport');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            (email, password, done) => {
            // console.log(email);
            // console.log(password);

            const query = 'SELECT * FROM users WHERE email = ?';
            // Match User
            connection.execute(
                query,
                [email],
                // eslint-disable-next-line consistent-return
                (err, results, fields) => {
                    // console.log(results);
                    // console.log(fields); // Fields contains extra meta data about results
                    if (err) {
                        throw err;
                    }
                    if (results.length === 0) {
                        console.log('Incorrect Email');
                        return done(null, false, { message: 'This email is not registered to our database' });
                    }

                    const user = results[0];

                        // Match Password
                        bcrypt.compare(password, user.password, (error, isMatch) => {
                            // console.log(password);
                            // console.log(user.password);
                            console.log(isMatch);
                            if (error) { throw error; }
                            if (isMatch) {
                                return done(null, user);
                            }
                            return done(null, false, { message: 'Incorrect Password!' });
                        });
                },
            );
},
),
    );
    passport.serializeUser((user, done) => {
        process.nextTick(() => {
          done(null, { email: user.email });
        });
      });
    passport.deserializeUser((Email, done) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.execute(query, [Email], (err, result) => {
            if (err) { throw err; }

            if (result.length === 0) {
                return done(null, false);
            }
            const user = result[0];
            return done(null, user);
        });
      });
};
