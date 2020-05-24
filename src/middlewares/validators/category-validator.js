const { CategorySchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateCreateCategory(req, res, next) {
  return ValidationHandlerUtil.validate(CategorySchemas.createCategorySchema, req, next);
}

function validateGetCategories(req, res, next) {
  return ValidationHandlerUtil.validate(CategorySchemas.categoryListing, req, next);
}

function validateCategoryId(req, res, next) {
  return ValidationHandlerUtil.validate(CategorySchemas.categoryIdSchema, req, next);
}

module.exports = {
  validateCategoryId,
  validateCreateCategory,
  validateGetCategories,
};
