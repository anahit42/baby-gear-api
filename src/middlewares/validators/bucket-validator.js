const { BucketSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateAddProductToBucket(req, res, next) {
  return ValidationHandlerUtil.validate(BucketSchemas.addProductToBucketSchema, req, next);
}

function validateUpdateBucket(req, res, next) {
  return ValidationHandlerUtil.validate(BucketSchemas.updateBucketSchema, req, next);
}

module.exports = {
  validateAddProductToBucket,
  validateUpdateBucket,
};
