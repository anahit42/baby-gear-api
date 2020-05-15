const express = require('express');
const router = express.Router();

const { getOrders } = require('../controllers/order-controller');

router.get('/', getOrders);

module.exports = router;
