const express = require('express');
const router = express.Router();
const { validateOrderId } = require('../middlewares/validators/order-validator');

const { getOrder } = require('../controllers/order-controller');

router.get('/:orderId', validateOrderId, getOrder);

module.exports = router;
