/* eslint-disable no-param-reassign */
const connection = require('../../database');

const viewAllOrders = () => {
    const query = 'SELECT orderID, email, perfumeTotal AS Total, Status FROM orders';

    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                console.log(err.message);
                reject(err);
            }
            results.forEach((order) => {
                if (order.Status === 1) {
                    order.Status = 'Pending';
                } else if (order.Status === 2) {
                    order.Status = 'Processing';
                } else if (order.Status === 3) {
                    order.Status = 'Shipping';
                } else if (order.Status === 4) {
                    order.Status = 'Delivered';
                } else if (order.Status === 5) {
                    order.Status = 'Cancelled';
                }
            });
            resolve(results);
        });
    });
};

/*  @Status
        1 pending
        2 processing
        3 shipping
        4 delivered
        5 cancelled
    */

const updateOrderStatusById = (orderID, newStatus) => {
    if (newStatus === 'Pending') {
        newStatus = 1;
    } else if (newStatus === 'Processing') {
        newStatus = 2;
    } else if (newStatus === 'Shipping') {
        newStatus = 3;
    } else if (newStatus === 'Delivered') {
        newStatus = 4;
    } else if (newStatus === 'Cancelled') {
        newStatus = 5;
    }

    const query = `UPDATE orders SET Status = '${newStatus}' WHERE orderID = '${orderID}'`;
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                console.log(err.message);
                reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = { viewAllOrders, updateOrderStatusById };
