const express = require('express');
const router = express.Router();

const { getProduct } = require('../controllers/product-controller');

router.get('/:productId', getProduct);

module.exports = router;
