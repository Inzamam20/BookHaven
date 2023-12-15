/* eslint-disable no-param-reassign */

const { getProducts, getParticularProduct } = require('../util/currentUser/product');
const { getUserData } = require('../util/currentUser/user');
const connection = require('../util/database');

// Function to truncate the description to a specified length
function truncateDescription(description, maxLength) {
    if (description && description.length > maxLength) {
        return `${description.substring(0, maxLength)}...`;
    }
    return description;
}

let products;
let currentUser;

async function fetchProductData() {
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

async function fetchUserData(email) {
    try {
        const loggedUser = await getUserData(email);
        [currentUser] = loggedUser;
        currentUser.image = currentUser.image.toString('base64');
        // console.log('From fetching Function:', currentUser);
    } catch (error) {
        console.log(error);
    }
}

const getIndex = async (req, res) => {
    try {
        await fetchProductData();

        if (!req.user) {
            currentUser = null;
            res.render('./index.ejs', { currentUser, products });
            // console.log(req.user);
        } else {
            console.log(req.user.user);
            await fetchUserData(req.user.user);
            // console.log(loggedUser);
            res.render('./index.ejs', { currentUser, products });
        }
    } catch (error) {
        console.log(error);
    }
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

    const query = `SELECT name FROM perfume WHERE name LIKE '%${searchQuery}%' LIMIT 5`;

    connection.query(query, (error, data) => {
        response.json(data);
    });
};

module.exports = { getIndex, getProduct, searchPerfumes };
