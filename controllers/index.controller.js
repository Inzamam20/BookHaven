const getProducts = require('../util/currentUser/product');
const currentUser = require('../util/currentUser/user');

let products;

async function fetchData() {
    try {
        products = await getProducts();
    } catch (err) {
        console.error(err);
    }
}

fetchData();

const getIndex = (req, res) => {
    res.render('./index.ejs', { currentUser, products });
};

module.exports = getIndex;
