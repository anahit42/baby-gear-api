const express = require('express');
const router = express.Router();

const { validatePaging, validateProductId } = require('../middlewares/validators/favorite-validator');
const { getFavorites, deleteFavorite } = require('../controllers/favorite-controller');

router.get('/products', validatePaging, getFavorites);
router.delete('/products/:productId', validateProductId, deleteFavorite);

module.exports = router;
