const config = require('config');
const { OrderSchemas } = require('./schemas');
const { handleErrorDetails } = require('./handlers');
const validationOptions = config.get('validation.options');

function validateGetOrder (req, res, next) {
  const { error } = OrderSchemas.orderGetSingle.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateListOrders (req, res, next){
  const { error } = OrderSchemas.orderList.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

module.exports = {
  validateGetOrder,
  validateListOrders
};
