const { OrderSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateGetOrder(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.getOrderSchema, req, next);
}

function validateListOrders(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.orderListSchema, req, next);
}

function validateCreateOrder(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.createOrderSchema, req, next);
}

function validateCreateOrderComplaint(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.createOrderComplaintSchema, req, next);
}

function validateUpdateDeliveryStatusSchema(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.deliveryStatusSchema, req, next);
}

module.exports = {
  validateGetOrder,
  validateListOrders,
  validateCreateOrder,
  validateCreateOrderComplaint,
  validateUpdateDeliveryStatusSchema,
};
