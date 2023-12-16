const connection = require('../database');

const getUserData = (email) => {
    const queryToUserData = `SELECT email, image FROM users WHERE email='${email}'`;

    return new Promise((resolve, reject) => {
        connection.query(queryToUserData, (err, result) => {
            if (err) {
                reject(err);
            }
            // console.log(result);
            resolve(result);
        });
    });
};

module.exports = { getUserData };
