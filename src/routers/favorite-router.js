const express = require('express');
const router = express.Router();

const { validatePaging } = require('../middlewares/validators/favorite-validator');
const { getFavorits } = require('../controllers/favorite-controller');

router.get('/products', validatePaging, getFavorits);

module.exports = router;
