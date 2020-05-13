const express = require('express');
const router = express.Router();

const { createProduct } = require('../controllers/product-controller');
const { validateCreateProduct } = require('../middlewares/validators/product-validator');
// create
router.post('/',validateCreateProduct,createProduct);

module.exports = router;
