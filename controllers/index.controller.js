/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */

const { getProducts, getParticularProduct } = require('../util/currentUser/product');
const { getUserData } = require('../util/currentUser/user');
const {
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
} = require('../util/queries/checkStock');
const connection = require('../util/database');

const transporter = require('../util/nodemailer');

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
            product.description = truncateDescription(product.Description, 90);

            // Price Calculation
            product.priceOf3ml = product.PPml * 3;
            product.priceOf3ml = Math.ceil(product.priceOf3ml / 5) * 5;

            product.priceOf5ml = product.PPml * 5 * 0.97;
            product.priceOf5ml = Math.ceil(product.priceOf5ml / 5) * 5;

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
    // return currentUser;
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

    // console.log(req.url);

    try {
        productInfo = await getParticularProduct(name);

        console.log(productInfo[0]);
        // console.log(req.user);
        productInfo[0].Thumbnail = productInfo[0].Thumbnail.toString('base64');

        // Price Calculation
        productInfo[0].priceOf3ml = productInfo[0].PPml * 3;
        productInfo[0].priceOf3ml = Math.ceil(productInfo[0].priceOf3ml / 5) * 5;

        productInfo[0].priceOf5ml = productInfo[0].PPml * 5 * 0.97;
        productInfo[0].priceOf5ml = Math.ceil(productInfo[0].priceOf5ml / 5) * 5;

        if (req.user === undefined) {
            currentUser = null;
        } else {
            await fetchUserData(req.user.user);
        }

        if (productInfo && productInfo[0].Name) {
            // console.log(currentUser);
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

const cartController = async (req, res) => {
    const { productId } = req.params;
    const { quantity, volume } = req.body; // Access the quantity from the request body
    const userEmail = req.user.user;
    // @bottleAmount -> Bottle Volume
    // @Quantity -> # of Bottle

    // console.log(`Product Id: ${productId} \nQuantity: ${quantity}`);
    // console.log('Selected Volume:', volume);
    try {
        const existingResultInCart = await checkifProductExistInCart(userEmail, productId);
        let totalExistingVolume = 0;

        let updatedQuantity = parseInt(quantity, 10);
        if (existingResultInCart !== null) {
            existingResultInCart.forEach((row) => {
                totalExistingVolume += row.bottleAmount * row.quantity;
            });
        }

        console.log(`Total Existing Volume: ${totalExistingVolume}`);

        // Check if the product is available in stock
        const isProductAvailable = await checkProductAvailability(
            productId,
            quantity,
            volume,
            totalExistingVolume
        );
        console.log(`Product Available: ${isProductAvailable}\n`);

        // If the product is already in the cart then return the volume that is already in the cart
        // and send a request to check with new volume if available in stock then update the cart
        // else if the product is not present in the cart then just insert into the cart

        if (!isProductAvailable) {
            return res.status(404).send('Product is out of stock');
        }

        if (existingResultInCart !== null) {
            console.log(existingResultInCart[0].quantity);
            existingResultInCart.forEach((bottle) => {
                if (bottle.bottleAmount === parseInt(volume, 10)) {
                    updatedQuantity += bottle.quantity;
                }
            });
        }

        console.log(`Updated Quantity: ${updatedQuantity}`);

        // Product is Available
        if (updatedQuantity === parseInt(quantity, 10)) {
            console.log('Adding Product to cart');
            await addProductToCart(
                userEmail,
                parseInt(productId, 10),
                parseInt(volume, 10),
                parseInt(quantity, 10)
            );
        } else {
            console.log('Updating Product to cart');
            await updateProductToCart(
                userEmail,
                parseInt(productId, 10),
                parseInt(volume, 10),
                updatedQuantity
            );
        }

        return res.status(200).send('Product added to cart successfully');
    } catch (error) {
        console.log('From cartController Error:');
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }

    // console.log(isProductAvailable);
};

const getCartCount = async (req, res) => {
    try {
        const cartCount = await getCartItemCount(req.user.user);
        // console.log(cartCount);
        res.json({ count: cartCount.count });
    } catch (error) {
        console.error('Error getting cart count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getCartInformation = async (req, res) => {
    try {
        const userEmail = req.user.user;

        await fetchUserData(req.user.user);

        const cartItems = await getCartDetails(userEmail);

        let grandTotal = 0;
        // console.log(cartItems);
        for (let i = 0; i < cartItems.length; i++) {
            const itemTotal = cartItems[i].price * cartItems[i].quantity;
            grandTotal += itemTotal;
        }

        const total = grandTotal;

        console.log(cartItems);

        res.render('viewCart.ejs', {
            currentUser,
            cartItems,
            total,
            userEmail,
        });
    } catch (error) {
        console.log(`Error from getCartInformation Function: ${error}`);
    }
};

const removeCartItemController = async (req, res) => {
    const userEmail = req.user.user;
    const { perfumeId } = req.params;
    const { volume, perfumeName, quantity } = req.body;

    try {
        const result = await removeCartItem(userEmail, perfumeId, volume, quantity);

        // Send a response based on the result
        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, message: `${perfumeName} removed successfully` });
        } else {
            res.status(500).json({
                success: false,
                message: `Failed to remove ${perfumeName} from the cart`,
            });
        }
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const orderController = async (req, res) => {
    const { phoneNo, address, deliveryType } = req.body;

    /*  @Status
        1 pending
        2 processing
        3 shipping
        4 delivered
        5 cancelled
    */

    const orderData = {
        email: req.user.user,
        phoneNo,
        address,
        status: 1,
    };

    if (deliveryType === 'insideDhaka') {
        orderData.deliveryFee = 60;
    } else {
        orderData.deliveryFee = 100;
    }

    try {
        await addOrder(orderData);
        const cartItems = await getCartDetails(orderData.email);
        // console.log(cartItems);
        for (const element of cartItems) {
            await addOrderDetails(
                orderData.orderID,
                element.perfumeID,
                element.price,
                element.quantity,
                element.bottleAmount
            );
        }

        await clearCart(orderData.email);

        await fetchUserData(req.user.user);

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: orderData.email,
            subject: 'Perfume Parlor order placed Successfully!',
            text: 'Dear User\n\nYour order of Perfume Parlor has been placed Successfully\n\nThanks for purchasing with us',
        };

        // To send Mail
        transporter.sendMail(mailOptions, (error, info) => {
            console.log('Callback executed'); // Add this line
            if (error) {
                console.log('Error Occured: ', error);
            } else {
                console.log(`Email sent: ${info.response.toString()}`);
                // console.log(`Your verification code is: ${code}`);
            }
        });

        res.status(200).json({ success: true, message: 'Order Placed Successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const viewOrdersController = async (req, res) => {
    try {
        await fetchUserData(req.user.user);
        const orders = await getAllOrders(req.user.user);
        orders.forEach((order) => {
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
        console.log(orders);
        res.render('orders', { currentUser, orders });
    } catch (error) {
        console.log(`Error from View Orders Controller: ${error.toString()}`);
    }
};

module.exports = {
    getIndex,
    getProduct,
    searchPerfumes,
    cartController,
    getCartCount,
    getCartInformation,
    removeCartItemController,
    orderController,
    viewOrdersController,
};
