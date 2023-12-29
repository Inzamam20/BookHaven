const express = require('express');

const router = express.Router();

const { authenticateJWT } = require('../middlewares/index.middlewares');
const {
    getIndex,
    getProduct,
    searchPerfumes,
    cartController,
    getCartCount,
    getCartInformation,
    removeCartItemController,
    orderController,
    viewOrdersController,
} = require('../controllers/index.controller');

router.get('/', authenticateJWT, getIndex);

router.get('/products/:productName', authenticateJWT, getProduct);

router.get('/get_data', searchPerfumes);
router.post('/cart/add/:productId', authenticateJWT, cartController);

router.get('/api/cart/count', authenticateJWT, getCartCount);

router.get('/cart/view', authenticateJWT, getCartInformation);

router.delete('/cart/remove/:perfumeId', authenticateJWT, removeCartItemController);

router.post('/cart/confirmorder', authenticateJWT, orderController);

router.get('/cart/order', authenticateJWT, viewOrdersController);

module.exports = router;
