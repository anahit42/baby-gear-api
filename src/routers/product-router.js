const express = require('express');
const router = express.Router();

const { createProduct } = require('../controllers/product-controller');
const { validateProductId, validateCreateProduct } = require('../middlewares/validators/product-validator');
const { getProduct, getProducts } = require('../controllers/product-controller');

router.get('/', getProducts);
router.post('/', validateCreateProduct, createProduct);
router.get('/:productId', validateProductId, getProduct);

module.exports = router;
