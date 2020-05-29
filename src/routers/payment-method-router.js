const express = require('express');

const router = express.Router();

const {
  validateCreatePaymentMethod,
  validateUpdatePaymentMethod,
  validateGetPaymentMethod,
} = require('../middlewares/validators/payment-method-validator');

const {
  createPaymentMethod,
  deletePaymentMethod,
  updateUserPaymentMethod,
} = require('../controllers/payment-method-controller');

router.post('/', validateCreatePaymentMethod, createPaymentMethod);
router.post('/:paymentMethodId', validateUpdatePaymentMethod, updateUserPaymentMethod);
router.delete('/:paymentMethodId', validateGetPaymentMethod, deletePaymentMethod);

module.exports = router;
