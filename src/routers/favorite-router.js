const express = require('express');
const router = express.Router();

const { validateProductId, validateProductOwner } = require('../controllers/favorite-controller');
const { deleteFavorite } = require('../controllers/favorite-controller');

router.delete('products/:productId', validateProductId, validateProductOwner, deleteFavorite);

module.exports = router;
