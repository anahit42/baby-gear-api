const express = require('express');
const router = express.Router();

const { validateProductId } = require('../middlewares/validators/product-validator');
const { getProduct, getProducts } = require('../controllers/product-controller');

router.get('/', getProducts);
router.get('/:productId', validateProductId, getProduct);

module.exports = router;
