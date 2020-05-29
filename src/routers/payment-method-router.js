const express = require('express');

const router = express.Router();

const {
  validateCreatePaymentMethod,
  validateGetPaymentMethod,
} = require('../middlewares/validators/payment-method-validator');

const { createPaymentMethod, deletePaymentMethod } = require('../controllers/payment-method-controller');

router.post('/', validateCreatePaymentMethod, createPaymentMethod);
router.delete('/:methodId', validateGetPaymentMethod, deletePaymentMethod);

module.exports = router;
