const config = require('config');
const validationOptions = config.get('validation.options');
const { ValidationError } = require('../../errors');
const { ProductSchemas } = require('./schemas');

async function validateCreateProduct(req, res, next)  {
  const { error } = ProductSchemas.productsCreateSchema.validate(req, validationOptions);
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }
  return next();
}


async function validateUpdateProduct (req, res, next) {
  const { error } = ProductSchemas.productsUpdateSchema.validate(req, validationOptions);
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }
  return next();
}


module.exports = {
  validateCreateProduct,
  validateUpdateProduct
};
