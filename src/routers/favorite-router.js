const express = require('express');
const router = express.Router();

const { validatePaging } = require('../middlewares/validators/favorite-validator');
const { getFavorites } = require('../controllers/favorite-controller');

router.get('/products', validatePaging, getFavorites);

module.exports = router;
