const express = require('express');

const router = express.Router();

const {
  validateGetOrder,
  validateListOrders,
  validateCreateOrder,
} = require('../middlewares/validators/order-validator');

const { getOrder, getOrders, createOrder } = require('../controllers/order-controller');

router.get('/', validateListOrders, getOrders);
router.post('/', validateCreateOrder, createOrder);
router.get('/:orderId', validateGetOrder, getOrder);

module.exports = router;
