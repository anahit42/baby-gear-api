const { BucketSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateBucketId(req, res, next) {
  return ValidationHandlerUtil.validate(BucketSchemas.getBucketSchema, req, next);
}

module.exports = {
  validateBucketId,
};
