/* eslint-disable arrow-body-style */
const connection = require('../database');

const getAllProduct = 'SELECT * FROM PERFUME';

const getProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query(getAllProduct, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
};

const getParticularProduct = (name) => {
    const getInfo = `SELECT * FROM PERFUME WHERE Name='${name}'`;

    return new Promise((resolve, reject) => {
        connection.query(getInfo, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
};
module.exports = { getProducts, getParticularProduct };
