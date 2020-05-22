module.exports = {};

const config = require('config');

const validationOptions = config.get('validation.options');

const { CategorySchemas } = require('./schemas');
const { handleErrorDetails } = require('./handlers');

function validateCreateCategory (req, res, next) {
  const { error } = CategorySchemas.createCategorySchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateCategoryId (req, res, next) {

  const { error } = CategorySchemas.categoryIdSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

module.exports = {
  validateCategoryId,
  validateCreateCategory
};
