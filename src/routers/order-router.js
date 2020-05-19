const express = require('express');
const router = express.Router();
const { validatePaging } = require('../middlewares/validators/order-validator');

const { getOrders } = require('../controllers/order-controller');

router.get('/', validatePaging, getOrders);

module.exports = router;
