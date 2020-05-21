const config = require('config');

const ValidationError = require('../../errors/validation-error');
const { OrderSchemas } = require('./schemas');

const validationOptions = config.get('validation.options');

function validateGetOrder (req, res, next) {
  const { error } = OrderSchemas.orderGetSingle.validate(req, validationOptions);

  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }

  return next();
}

function validateListOrders (req, res, next){
  const { error } = OrderSchemas.orderList.validate(req, validationOptions);

  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }

  return next();
}

module.exports = {
  validateGetOrder,
  validateListOrders
};
