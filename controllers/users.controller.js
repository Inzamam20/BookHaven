const getLogin = (req, res) => {
    res.render('./users/login.ejs');
};

const postLogin = (req, res) => {};

const getRegister = (req, res) => {
    res.render('./users/signup.ejs');
};

const postRegister = () => {};

module.exports = {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
};
