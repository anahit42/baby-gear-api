const express = require('express');

const router = express.Router();

const {
  validateGetOrder,
  validateListOrders,
  validateCreateOrder,
  validateOrderComplaints,
} = require('../middlewares/validators/order-validator');

const {
  getOrder,
  getOrders,
  createOrder,
  complainOrder,
} = require('../controllers/order-controller');

router.get('/', validateListOrders, getOrders);
router.post('/', validateCreateOrder, createOrder);
router.get('/:orderId', validateGetOrder, getOrder);
router.post('/:orderId/complaints', validateOrderComplaints, complainOrder);

module.exports = router;
