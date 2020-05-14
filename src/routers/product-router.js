const express = require('express');
const router = express.Router();

const { createProduct , updateProduct } = require('../controllers/product-controller');
const { validateCreateProduct,validateUpdateProduct } = require('../middlewares/validators/product-validator');

router.post('/',validateCreateProduct,createProduct);

router.patch('/:id',validateUpdateProduct,updateProduct);

module.exports = router;
