const config = require('config');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const validationOptions = config.get('validation.options');
const { handleErrorDetails } = require('./handlers');
const { ProductSchemas } = require('./schemas');

function validateCreateProduct(req, res, next)  {
  const { error } = ProductSchemas.productsCreateSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateUpdateProduct (req, res, next) {
  const { error } = ProductSchemas.productsUpdateSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateProductId(req, res, next) {
  const { productId } = req.params;

  const schema = Joi.object().keys({
    productId: Joi.objectId()
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
