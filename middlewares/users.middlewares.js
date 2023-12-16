/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */

const isLoggedIn = (req, res, next) => {
    const { Email, password } = req.body;

    if (req.url == '/login' && Email == 'admin' && password == 'admin') {
        res.redirect('/admin/dashboard');
    } else {
        next();
    }
};

// const authenticateToken = (req, res, next) => {
//     const { accessToken } = req.cookies;

//     if (!accessToken) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     jwt.verify(accessToken, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] }, (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: 'Forbidden, Verification Failed!' });
//         }

//         req.user = user;
//         next();
//     });
// };

const getUserData = async (req, res, next) => {
    try {
        const userData = await getUserByEmail(req.user.email);
        req.userData = userData;
        next();
    } catch (err) {
        next(err);
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
    } else if (req.method == 'get' && req.url == '/login') {
        res.sendFile('login', { root: './views/users' });
        next();
    }
};

module.exports = { isLoggedIn, alreadyMember, authenticateToken };
