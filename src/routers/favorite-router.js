const express = require('express');

const router = express.Router();

const { validateGetFavorite, validateListFavorites } = require('../middlewares/validators/favorite-validator');
const { getFavorites, deleteFavorite } = require('../controllers/favorite-controller');

router.get('/products', validateListFavorites, getFavorites);
router.delete('/products/:productId', validateGetFavorite, deleteFavorite);

module.exports = router;
