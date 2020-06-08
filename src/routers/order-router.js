const express = require('express');

const router = express.Router();

const {
  validateGetOrder,
  validateListOrders,
  validateCreateOrder,
  validateUpdateDeliveryStatusSchema,
} = require('../middlewares/validators/order-validator');

const { getOrder, getOrders, createOrder, updateDeliveryStatus } = require('../controllers/order-controller');

router.get('/', validateListOrders, getOrders);
router.post('/', validateCreateOrder, createOrder);
router.get('/:orderId', validateGetOrder, getOrder);
router.patch('/:orderId/delivery', validateUpdateDeliveryStatusSchema, updateDeliveryStatus);
module.exports = router;
