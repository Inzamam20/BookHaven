/* eslint-disable no-param-reassign */
const { getProducts, getParticularProduct } = require('../util/currentUser/product');
const currentUser = require('../util/currentUser/user');
const connection = require('../util/database');

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
            // console.log(products);
        });
    } catch (err) {
        console.error(err);
    }
}

// fetchData();

const getIndex = async (req, res) => {
    await fetchData();
    res.render('./index.ejs', { currentUser, products });
};

const getProduct = async (req, res) => {
    const name = req.params.productName;
    let productInfo;

    try {
        productInfo = await getParticularProduct(name);

        console.log(productInfo[0]);
        productInfo[0].Thumbnail = productInfo[0].Thumbnail.toString('base64');

        if (productInfo && productInfo[0].Name) {
            res.render('product', { currentUser, productInfo });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error(error);
        // res.status(500).send('Internal Server Error');
    }
};

const searchPerfumes = (request, response) => {
    const searchQuery = request.query.search_query;

    const query = `SELECT name FROM perfumes WHERE name LIKE '%${searchQuery}%' LIMIT 5`;

    connection.query(query, (error, data) => {
        response.json(data);
    });
};

module.exports = { getIndex, getProduct, searchPerfumes };
