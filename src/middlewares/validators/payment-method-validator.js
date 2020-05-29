const { PaymentMethodSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateCreatePaymentMethod(req, res, next) {
  return ValidationHandlerUtil.validate(PaymentMethodSchemas.createPaymentMethodSchema, req, next);
}
function validateGetPaymentMethod(req, res, next) {
  return ValidationHandlerUtil.validate(PaymentMethodSchemas.getPaymentMethodSchema, req, next);
}

module.exports = {
  validateCreatePaymentMethod,
  validateGetPaymentMethod,
};
