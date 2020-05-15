const express = require('express');
const router = express.Router();

const { getFavorits } = require('../controllers/favorite-controller');

router.get('/products', getFavorits);

module.exports = router;
