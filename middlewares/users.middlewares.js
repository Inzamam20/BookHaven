/* eslint-disable comma-dangle */
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
        console.log(Email);
        // res.redirect('/login');
    }
};

const alreadyMember = (req, res, next) => {
    if (req.method == 'POST') {
        const { username, email, password } = req.body;
        if (req.url == '/login') {
            res.sendFile('login', { root: './views/users' });
            console.log(username);
            next();
        } else {
            res.send(
                `<h2>user with ${username}\n Email: ${email}\n Password: ${password}\n  is trying to create an account`
            );
            console.log(username);
        }
    } else {
        next();
    }
};

module.exports = { isLoggedIn, alreadyMember };
