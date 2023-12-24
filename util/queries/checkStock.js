/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable arrow-body-style */
const connection = require('../database');

// @bottleAmount -> Bottle Volume
// @Quantity -> # of Bottle

const checkifProductExistInCart = (email, perfumeID) => {
    return new Promise((resolve, reject) => {
        const queryToCheckIfProductExist = `SELECT bottleAmount, quantity FROM cart WHERE email='${email}' AND perfumeID='${perfumeID}'`;
        connection.query(queryToCheckIfProductExist, (err, results) => {
            if (err) {
                console.log(`Error from checkifProductExistInCart Function: \n ${err}`);
                reject(err);
            }

            // Check if the results array is not empty before accessing elements
            if (results && results.length > 0) {
                resolve(results);
            } else {
                // If no results found, resolve with null or appropriate values
                resolve(null);
            }
        });
    });
};

const checkProductAvailability = (perfumeID, inputQuantity, inputVolume, existingVolume) => {
    return new Promise((resolve, reject) => {
        const queryToCheckStock = `SELECT quantity FROM perfume WHERE id='${perfumeID}'`;
        // Quantity == Remaining Volume

        connection.query(queryToCheckStock, (err, results) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            // console.log(`Input Quantity is: ${inputQuantity}`);
            // console.log(results);
            // Assuming 'results' is an array of objects, get the quantity from the first result
            let remainingVolume = results.length > 0 ? results[0].quantity : 0;
            remainingVolume -= existingVolume;

            const clientDemand = inputQuantity * inputVolume;

            // Compare with the requested quantity and resolve the promise accordingly
            resolve(clientDemand <= remainingVolume);
        });
    });
};

const addProductToCart = (email, perfumeID, bottleAmount, quantity) => {
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

                resolve(result);
            }
        );
    });
};

module.exports = { checkProductAvailability, addProductToCart, checkifProductExistInCart };
