const config = require('config');
const Joi = require('@hapi/joi');

const validationOptions = config.get('validation.options');
const { handleErrorDetails } = require('./handlers');
const { ProductSchemas } = require('./schemas');

function validateCreateProduct(req, res, next) {
  const { error } = ProductSchemas.productsCreateSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateUpdateProduct(req, res, next) {
  const { error } = ProductSchemas.productsUpdateSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateProductId(req, res, next) {
  const { productId } = req.params;

  const schema = Joi.object().keys({
    productId: Joi.string().hex().length(24).required(),
  });

  const { error } = schema.validate({ productId });

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

module.exports = {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
};
