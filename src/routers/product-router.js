const express = require('express');
const router = express.Router();

const { getProducts } = require('../controllers/product-controller');

router.get('/', getProducts);

module.exports = router;
