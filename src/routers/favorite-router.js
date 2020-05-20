const express = require('express');
const router = express.Router();

const { validatePaging, validateProductId, validateAddFavoriteProduct } = require('../middlewares/validators/favorite-validator');
const { getFavorites, deleteFavorite, addFavoriteProduct} = require('../controllers/favorite-controller');

router.get('/products', validatePaging, getFavorites);
router.post('/products', validateAddFavoriteProduct, addFavoriteProduct);
router.delete('/products/:productId', validateProductId, deleteFavorite);

module.exports = router;
