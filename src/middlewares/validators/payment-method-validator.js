const { PaymentMethodSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateCreatePaymentMethod(req, res, next) {
  return ValidationHandlerUtil.validate(PaymentMethodSchemas.createPaymentMethodSchema, req, next);
}
function validateGetPaymentMethod(req, res, next) {
  return ValidationHandlerUtil.validate(PaymentMethodSchemas.getPaymentMethodSchema, req, next);
}

function validateUpdatePaymentMethod(req, res, next) {
  return ValidationHandlerUtil.validate(PaymentMethodSchemas.updatePaymentMethodSchema, req, next);
}

module.exports = {
  validateCreatePaymentMethod,
  validateUpdatePaymentMethod,
  validateGetPaymentMethod,
};
