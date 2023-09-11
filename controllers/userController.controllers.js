/* eslint-disable comma-dangle */
// const { route, router } = require('../app');

const { use } = require('../app');

const getRegister = (req, res) => {
    res.sendFile('signup.html', { root: './views/users' });
};

const postRegister = (req, res) => {
    const { username, email, password } = req.body;
    console.log(username);
    res.send(
        `<h2>user with ${username}\n Email: ${email}\n Password: ${password}\n  is trying to create an account`
    );
};
const getLogin = (req, res) => {
    // res.send('This is Login Page');
    // const { id, username } = req.query;

    // const { username } = req.query;
    // res.send(`User with ID - ${id} and Username - ${username} is requesting to login`);
    res.sendFile('login.html', { root: './views/users' });
    // res.sendFile('styles.css', { root: './views/users' });
};

const getHomePage = (req, res) => {
    res.sendFile('register.html', { root: './views/users' });
};

const getDashboard = (req, res) => {
    res.sendFile('GeneralDashboard.html', { root: './views' });
};

module.exports = {
    getRegister,
    postRegister,
    getLogin,
    getDashboard,
    getHomePage,
};
