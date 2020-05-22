const config = require('config');

const { UserSchemas } = require('./schemas');
const { handleErrorDetails } = require('./handlers');

const validationOptions = config.get('validation.options');

function validateRegisterUser(req, res, next) {
  const { error } = UserSchemas.registerUserSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateLoginUser(req, res, next) {
  const { error } = UserSchemas.loginUserSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateUserId(req, res, next) {
  const { error } = UserSchemas.userIdSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateUpdateUser(req, res, next) {
  const { error } = UserSchemas.updateUserSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateLimitSkip(req, res, next) {
  const { error } = UserSchemas.limitSkipSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

module.exports = {
  validateRegisterUser,
  validateUpdateUser,
  validateUserId,
  validateLoginUser,
  validateLimitSkip,
};
