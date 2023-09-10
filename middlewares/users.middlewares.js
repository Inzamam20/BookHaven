/* eslint-disable eqeqeq */
const isLoggedIn = (req, res, next) => {
    const { Email, password } = req.body;

    if (Email == 'admin' && password == 'admin') {
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = isLoggedIn;
