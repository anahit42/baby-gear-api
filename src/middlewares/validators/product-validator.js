const config = require('config');
const validationOptions = config.get('validation.options');
const { ValidationError } = require('../../errors');
const { ProductSchemas } = require('./schemas');

const validateCreateProduct = (req, res, next) => {
  const { error } = ProductSchemas.productsCreateSchema.validate(req, validationOptions);
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }
  return next();
};


const validateUpdateProduct = (req, res, next) => {
  const { error } = ProductSchemas.productsUpdateSchema.validate(req, validationOptions);
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }
  return next();
};


module.exports = {
  validateCreateProduct,
  validateUpdateProduct
};
