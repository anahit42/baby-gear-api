const { OrderSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateGetOrder(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.orderGetSingle, req, next);
}

function validateListOrders(req, res, next) {
  return ValidationHandlerUtil.validate(OrderSchemas.orderList, req, next);
}

module.exports = {
  validateGetOrder,
  validateListOrders,
};
