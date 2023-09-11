const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    // res.render('./users/signup.ejs');
    res.render('./index.ejs');
});

module.exports = router;
