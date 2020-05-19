const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const { ValidationError } = require('../../errors');

function validateProductId(req, res, next) {
  const { productId } = req.params;

  const schema = Joi.object().keys({
    productId: Joi.objectId()
  });

  const result = schema.validate({ productId });

  if (result.error) {
    const { details } = result.error;

    const message = details.map(detail => detail.message).join(',');

    return next(new ValidationError(message));
  }

  return next();
}

module.exports = {
  validateProductId
};
