/* eslint-disable arrow-body-style */
const connection = require('../database');

const getAllProduct = 'SELECT * FROM PERFUMES';

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

module.exports = getProducts;
