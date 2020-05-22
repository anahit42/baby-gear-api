const config = require('config');

const validationOptions = config.get('validation.options');

const { UserSchemas } = require('./schemas');
const { handleErrorDetails } = require('./handlers');

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

  req.query.limit = parseInt(req.query.limit);
  req.query.skip = parseInt(req.query.skip);

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
  validateLimitSkip
};
