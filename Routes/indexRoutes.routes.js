const express = require('express');

const router = express.Router();

const { authenticateJWT } = require('../middlewares/index.middlewares');
const {
    getIndex,
    getProduct,
    searchPerfumes,
    cartController,
} = require('../controllers/index.controller');

router.get('/', authenticateJWT, getIndex);

router.get('/products/:productName', authenticateJWT, getProduct);

router.get('/get_data', searchPerfumes);
router.post('/cart/add/:productId', authenticateJWT, cartController);

module.exports = router;
