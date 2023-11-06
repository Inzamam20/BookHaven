const express = require('express');

const router = express.Router();

const getIndex = require('../controllers/index.controller');

router.get('/', getIndex);

module.exports = router;
