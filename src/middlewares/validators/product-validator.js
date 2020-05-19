const config = require('config');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const validationOptions = config.get('validation.options');
const { ValidationError } = require('../../errors');
const { ProductSchemas } = require('./schemas');

function validateCreateProduct(req, res, next)  {
  const { error } = ProductSchemas.productsCreateSchema.validate(req, validationOptions);

  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }

  return next();
}

function validateUpdateProduct (req, res, next) {
  const { error } = ProductSchemas.productsUpdateSchema.validate(req, validationOptions);

  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }

  return next();
}

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
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
};
