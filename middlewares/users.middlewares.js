/* eslint-disable eqeqeq */
const isLoggedIn = (req, res, next) => {
    const { Email, password } = req.body;

    if (req.url == '/login' && Email == 'admin' && password == 'admin') {
        next();
    } else {
        res.send(
            // eslint-disable-next-line prettier/prettier
            `<h3>user with Email -${Email} and Password - ${password} is requesting to access</h3>`,
        );
        // res.redirect('/login');
    }
};

module.exports = isLoggedIn;
