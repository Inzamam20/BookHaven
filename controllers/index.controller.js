/* eslint-disable no-param-reassign */
const getProducts = require('../util/currentUser/product');
const currentUser = require('../util/currentUser/user');

// Function to truncate the description to a specified length
function truncateDescription(description, maxLength) {
    if (description && description.length > maxLength) {
        return `${description.substring(0, maxLength)}...`;
    }
    return description;
}

let products;

async function fetchData() {
    try {
        products = await getProducts();

        products.forEach((product) => {
            product.description = truncateDescription(product.Description, 95);
        });
        // console.log(products);
    } catch (err) {
        console.error(err);
    }
}

fetchData();

const getIndex = (req, res) => {
    res.render('./index.ejs', { currentUser, products });
};

module.exports = getIndex;
