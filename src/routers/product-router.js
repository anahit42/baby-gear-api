const express = require('express');
const router = express.Router();

const { deleteProduct } = require('../controllers/product-controller');

router.delete('/:productId', deleteProduct);

module.exports = router;
