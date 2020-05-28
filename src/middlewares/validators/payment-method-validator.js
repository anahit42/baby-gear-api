const { PaymentMethodSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateCreatePaymentMethod(req, res, next) {
  return ValidationHandlerUtil.validate(PaymentMethodSchemas.createPaymentMethodSchema, req, next);
}

function validateUpdatePaymentMethod(req, res, next) {
  return ValidationHandlerUtil.validate(PaymentMethodSchemas.updatePaymentMethodSchema, req, next);
}

function validateMethodId(req, res, next) {
  return ValidationHandlerUtil.validate(PaymentMethodSchemas.methodIdSchema, req, next);
}

module.exports = {
  validateCreatePaymentMethod,
  validateUpdatePaymentMethod,
  validateMethodId,
};
