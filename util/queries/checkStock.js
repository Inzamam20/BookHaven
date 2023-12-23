/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable arrow-body-style */
const connection = require('../database');

const checkProductAvailability = (productId, inputQuantity, inputVolume) => {
    return new Promise((resolve, reject) => {
        const queryToCheckStock = `SELECT quantity FROM perfume WHERE id='${productId}'`;

        connection.query(queryToCheckStock, (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            // console.log(`Input Quantity is: ${inputQuantity}`);
            // console.log(results);
            // Assuming 'results' is an array of objects, get the quantity from the first result
            const remainingVolume = results.length > 0 ? results[0].quantity : 0;

            const clientDemand = inputQuantity * inputVolume;

            // Compare with the requested quantity and resolve the promise accordingly
            resolve(clientDemand <= remainingVolume);
        });
    });
};

const addProductToCart = (email, perfumeID, bottleAmount, quantity) => {
    // @bottleAmount -> Bottle Volume
    // @Quantity -> # of Bottle
    return new Promise((resolve, reject) => {
        console.log(bottleAmount);
        const queryStatement = 'INSERT INTO cart VALUES (?, ?, ?, ?)';
        // 'INSERT INTO cart (email, perfumeID, bottleAmount, quantity) VALUES (?, ?, ?, ?)';
        connection.query(
            queryStatement,
            [email, perfumeID, bottleAmount, quantity],
            (err, result) => {
                if (err) {
                    console.log(
                        `An Error Occured while inserting cart Values into Database: ${err.message}`
                    );
                    reject(err);
                }

                console.log(result);
                resolve(result);
            }
        );
    });
};

module.exports = { checkProductAvailability, addProductToCart };
