const express = require('express');
const router = express.Router();

const { getOrder } = require('../controllers/order-controller');

router.get('/:orderId', getOrder);

module.exports = router;
