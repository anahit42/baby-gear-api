const express = require('express');

const router = express.Router();

const { validateGetOrder, validateListOrders } = require('../middlewares/validators/order-validator');

const { getOrder, getOrders } = require('../controllers/order-controller');

router.get('/', validateListOrders, getOrders);
router.get('/:orderId', validateGetOrder, getOrder);

module.exports = router;
