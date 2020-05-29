const express = require('express');

const router = express.Router();

const { validateCreatePaymentMethod,
  validateUpdatePaymentMethod,
  validatePaymentMethodId } = require('../middlewares/validators/payment-method-validator');
const { createPaymentMethod, updateUserPaymentMethod } = require('../controllers/payment-method-controller');

router.post('/', validateCreatePaymentMethod, createPaymentMethod);
router.post('/:paymentMethodId', validatePaymentMethodId, validateUpdatePaymentMethod, updateUserPaymentMethod);

module.exports = router;
