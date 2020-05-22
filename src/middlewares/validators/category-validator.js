const config = require('config');

const { CategorySchemas } = require('./schemas');
const { handleErrorDetails } = require('./handlers');

const validationOptions = config.get('validation.options');

function validateGetCategories(req, res, next) {
  const { error } = CategorySchemas.categoryListing.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateCreateCategory(req, res, next) {
  const { error } = CategorySchemas.categoryCreate.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

module.exports = {
  validateGetCategories,
  validateCreateCategory,
};
