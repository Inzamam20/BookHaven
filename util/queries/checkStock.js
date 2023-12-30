/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
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

const updateProductToCart = (email, perfumeID, volume, updatedQuantity) => {
    return new Promise((resolve, reject) => {
        const queryToUpdate = `UPDATE cart SET quantity='${updatedQuantity}' WHERE email='${email}' AND perfumeID='${perfumeID}' AND bottleAmount='${volume}'`;
        connection.query(queryToUpdate, (err, results) => {
            if (err) {
                console.log(
                    `An Error Occured while updating cart Values into Database: ${err.message}`
                );
                reject(err);
            }
            resolve(results);
        });
    });
};

const getCartItemCount = (email) => {
    return new Promise((resolve, reject) => {
        const queryToGetCount = `SELECT * FROM cart WHERE email='${email}'`;
        connection.query(queryToGetCount, (err, results) => {
            if (err) {
                console.log(
                    `An Error Occured while getting cart count from Database: ${err.message}`
                );
                reject(err);
            }
            resolve({ count: results.length });
        });
    });
};

// Function to calculate price based on bottleAmount and rules
const calculatePrice = (PPml, bottleAmount) => {
    let price;

    if (bottleAmount === 3) {
        price = PPml * 3;
        price = Math.ceil(price / 5) * 5;
    } else if (bottleAmount === 5) {
        price = PPml * 5 * 0.97;
        price = Math.ceil(price / 5) * 5;
    }

    return price;
};

const getCartDetails = (email) => {
    return new Promise((resolve, reject) => {
        const resultObject = {};

        // Fetch the cart list
        const queryToGetCartList = `SELECT * FROM cart WHERE email='${email}'`;

        connection.query(queryToGetCartList, (err, cartList) => {
            if (err) {
                console.log(err.message);
                reject(err);
            }

            // Prepare an array of promises for fetching details
            const promises = cartList.map((cartItem) => {
                return new Promise((resolveDetails, rejectDetails) => {
                    const queryToGetCartDetails = `
                SELECT p.Name, c.bottleAmount, c.quantity, p.PPml, c.perfumeID
                FROM cart c
                JOIN perfume p ON c.perfumeID = p.id
                WHERE p.id='${cartItem.perfumeID}'`;

                    connection.query(queryToGetCartDetails, (error, details) => {
                        if (error) {
                            console.error(error.message);
                            rejectDetails(error);
                            return;
                        }

                        // Assign details to the property named after the perfume ID
                        resultObject[cartItem.perfumeID] = details;

                        resolveDetails(); // Resolve the inner promise
                    });
                });
            });

            // Resolve the main promise when all details are fetched
            Promise.all(promises)
                .then(() => {
                    const cartObject = Object.values(resultObject).flat();

                    const cartDetailsWithPrice = cartObject.map((item) => ({
                        ...item,
                        price: calculatePrice(item.PPml, item.bottleAmount),
                    }));

                    // console.log(cartDetailsWithPrice);
                    resolve(cartDetailsWithPrice);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
};

const removeCartItem = async (email, perfumeID, volume, quantity) => {
    return new Promise((resolve, reject) => {
        const queryToDelete = `DELETE FROM cart WHERE email='${email}' AND perfumeID='${perfumeID}' AND bottleAmount='${volume}' AND quantity='${quantity}'`;

        connection.query(queryToDelete, (err, results) => {
            if (err) {
                console.log(err.message);
                reject(err);
            }
            resolve(results);
        });
    });
};

function generateRandomChars(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomChars = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomChars += chars.charAt(randomIndex);
    }

    return randomChars;
}

function generateOrderID() {
    const timestamp = new Date().getTime().toString(); // Get current timestamp as string
    const last7Digits = timestamp.slice(-6); // Keep the last 6 digits of the timestamp
    const randomChars = generateRandomChars(10 - last7Digits.length);
    // Concatenate the two strings
    const orderID = `${last7Digits}${randomChars}`; // Concatenate last 7 digits and random characters

    // Convert the string to an array of characters for shuffling
    const resultArray = orderID.split('');

    // Shuffle the array of characters
    for (let i = resultArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultArray[i], resultArray[j]] = [resultArray[j], resultArray[i]];
    }

    // Convert the array back to a string
    const mixedString = resultArray.join('');

    return mixedString;
}

const addOrder = async (data) => {
    const orderID = generateOrderID();
    data.orderID = orderID;
    const query =
        'INSERT INTO orders ( orderID, email, phoneNo, Address, deliveryFee, Status ) VALUES (?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        connection.query(
            query,
            [orderID, data.email, data.phoneNo, data.address, data.deliveryFee, data.status],
            (err) => {
                if (err) {
                    console.log('Error during inserting data into Orders table ', err.message);
                    reject(err);
                }
                resolve(orderID);
            }
        );
    });
};

const addOrderDetails = async (OrderID, PerfumeID, UnitPrice, Quantity, BottleAmount) => {
    const query = 'INSERT INTO orderdetails VALUES (?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        connection.query(query, [OrderID, PerfumeID, UnitPrice, Quantity, BottleAmount], (err) => {
            if (err) {
                console.log(err.message);
                reject(err);
            }
            resolve();
        });
    });
};

const clearCart = async (email) => {
    const query = `DELETE FROM cart WHERE email='${email}'`;
    return new Promise((resolve, reject) => {
        connection.query(query, (err) => {
            if (err) {
                console.log(err.message);
                reject(err);
            }
            resolve();
        });
    });
};

const getAllOrders = async (email) => {
    const query = `SELECT orderID, perfumeTotal AS Total, deliveryFee, Status FROM orders WHERE email='${email}'`;
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                console.log(`Error Retrieving Order Table from database ${err.message}`);
                reject(err);
            }

            resolve(results);
        });
    });
};

module.exports = {
    checkProductAvailability,
    addProductToCart,
    checkifProductExistInCart,
    updateProductToCart,
    getCartItemCount,
    getCartDetails,
    removeCartItem,
    addOrder,
    addOrderDetails,
    clearCart,
    getAllOrders,
};
