const { ProductSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateCreateProduct(req, res, next) {
  return ValidationHandlerUtil.validate(ProductSchemas.productsCreateSchema, req, next);
}

function validateUpdateProduct(req, res, next) {
  return ValidationHandlerUtil.validate(ProductSchemas.productsUpdateSchema, req, next);
}

function validateProductId(req, res, next) {
  return ValidationHandlerUtil.validate(ProductSchemas.productIdSchema, req, next);
}

function validateProductSearch(req, res, next) {
  return ValidationHandlerUtil.validate(ProductSchemas.productSearchSchema, req, next);
}

module.exports = {
  validateProductId,
  validateCreateProduct,
  validateUpdateProduct,
  validateProductSearch,
};
