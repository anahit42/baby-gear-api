const { OrderSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateGetOrder(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.orderGetSingle, req, next);
}

function validateListOrders(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.orderList, req, next);
}

function validateCreateOrder(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.createOrder, req, next);
}

function validateOrderId(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.orderIdSchema, req, next);
}

module.exports = {
  validateGetOrder,
  validateListOrders,
  validateCreateOrder,
  validateOrderId,
};
