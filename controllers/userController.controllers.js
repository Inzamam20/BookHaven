const { route, router } = require('../app');

const getRegister = (req, res) => {
    res.SendFile('register.html', { root: './views/users' });
};

const postRegister = () => {};

const getLogin = (req, res) => {
    // res.send('This is Login Page');
    // const { id, username } = req.query;

    // const { username } = req.query;
    // res.send(`User with ID - ${id} and Username - ${username} is requesting to login`);
    res.sendFile('login.html', { root: './views/users' });
    // res.sendFile('styles.css', { root: './views/users' });
};

const getDashboard = (req, res) => {
    res.send('User Dashboard');
};

const getAbout = (req, res) => {
    res.sendFile('about.html', { root: './views/users' });
};

module.exports = {
    getRegister,
    postRegister,
    getLogin,
    getDashboard,
    getAbout,
};
