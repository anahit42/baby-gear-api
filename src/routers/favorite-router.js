const express = require('express');
const router = express.Router();

const { validateProductId } = require('../controllers/favorite-controller');
const { deleteFavorite } = require('../controllers/favorite-controller');

router.delete('products/:productId', validateProductId, deleteFavorite);

module.exports = router;
