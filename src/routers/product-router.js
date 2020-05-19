const express = require('express');
const router = express.Router();

const { validateProductId, validateCreateProduct, validateUpdateProduct } = require('../middlewares/validators/product-validator');
const { getProduct, getProducts, updateProduct, createProduct } = require('../controllers/product-controller');

router.get('/', getProducts);
router.post('/', validateCreateProduct, createProduct);
router.get('/:productId', validateProductId, getProduct);
router.patch('/:productId', validateUpdateProduct, updateProduct);

module.exports = router;
