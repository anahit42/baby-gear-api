const express = require('express');
const router = express.Router();

const { ProductModel } = require('../models');
const { pageinatedResults} = require('../controllers/product-controller');

router.get('/products', pageinatedResults(ProductModel))
module.exports = router;
