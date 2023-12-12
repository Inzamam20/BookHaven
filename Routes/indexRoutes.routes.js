const express = require('express');

const router = express.Router();

const { getIndex, getProduct, searchPerfumes } = require('../controllers/index.controller');

router.get('/', getIndex);

router.get('/products/:productName', getProduct);

router.get('/get_data', searchPerfumes);

module.exports = router;
