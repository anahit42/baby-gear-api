const express = require('express');

const router = express.Router();

const {
  validateGetFavorite,
  validateListFavorites,
  validateAddFavoriteProduct,
} = require('../middlewares/validators/favorite-validator');


const { getFavorites, deleteFavorite, addFavoriteProduct } = require('../controllers/favorite-controller');

router.get('/products', validateListFavorites, getFavorites);
router.post('/products', validateAddFavoriteProduct, addFavoriteProduct);
router.delete('/products/:productId', validateGetFavorite, deleteFavorite);

module.exports = router;
