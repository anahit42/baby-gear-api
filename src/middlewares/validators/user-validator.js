const { UserSchemas } = require('./schemas');
const { ValidationHandlerUtil } = require('../../utils');

function validateRegisterUser(req, res, next) {
  return ValidationHandlerUtil.validate(UserSchemas.registerUserSchema, req, next);
}

function validateLoginUser(req, res, next) {
  return ValidationHandlerUtil.validate(UserSchemas.loginUserSchema, req, next);
}

function validateUserId(req, res, next) {
  return ValidationHandlerUtil.validate(UserSchemas.userIdSchema, req, next);
}

function validateUpdateUser(req, res, next) {
  return ValidationHandlerUtil.validate(UserSchemas.updateUserSchema, req, next);
}

function validateLimitSkip(req, res, next) {
  return ValidationHandlerUtil.validate(UserSchemas.limitSkipSchema, req, next);
}

module.exports = {
  validateRegisterUser,
  validateUpdateUser,
  validateUserId,
  validateLoginUser,
  validateLimitSkip,
};
