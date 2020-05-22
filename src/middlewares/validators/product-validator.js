const config = require('config');

const { handleErrorDetails } = require('./handlers');
const { ProductSchemas } = require('./schemas');

const validationOptions = config.get('validation.options');

function validateCreateProduct(req, res, next) {
  const { error } = ProductSchemas.productsCreateSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateUpdateProduct(req, res, next) {
  const { error } = ProductSchemas.productIdSchemas.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateProductId(req, res, next) {
  const { error } = ProductSchemas.productsUpdateSchema.validate(req, validationOptions);

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
