const express = require('express');

const router = express.Router();

const { authenticateJWT } = require('../middlewares/index.middlewares');
const { getIndex, getProduct, searchPerfumes } = require('../controllers/index.controller');

router.get('/', authenticateJWT, getIndex);

router.get('/products/:productName', authenticateJWT, getProduct);

router.get('/get_data', searchPerfumes);

module.exports = router;
