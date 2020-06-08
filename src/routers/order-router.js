const express = require('express');

const router = express.Router();

const {
  validateGetOrder,
  validateListOrders,
  validateCreateOrder,
  validateCreateOrderComplaint,
  validateUpdateDeliveryStatusSchema,
} = require('../middlewares/validators/order-validator');


const {
  getOrder,
  getOrders,
  createOrder,
  updateDeliveryStatus,
  createOrderComplaint,
} = require('../controllers/order-controller');

router.get('/', validateListOrders, getOrders);
router.post('/', validateCreateOrder, createOrder);
router.get('/:orderId', validateGetOrder, getOrder);
router.post('/:orderId/complaints', validateCreateOrderComplaint, createOrderComplaint);
router.patch('/:orderId/delivery', validateUpdateDeliveryStatusSchema, updateDeliveryStatus);
module.exports = router;
