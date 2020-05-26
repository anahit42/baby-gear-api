const express = require('express');

const router = express.Router();

const { validateCreatePaymentMethod } = require('../middlewares/validators/payment-method-validator');
const { createPaymentMethod } = require('../controllers/payment-method-controller');

router.post('/', validateCreatePaymentMethod, createPaymentMethod);

module.exports = router;
