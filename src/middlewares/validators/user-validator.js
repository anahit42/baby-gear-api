const config = require('config');

const validationOptions = config.get('validation.options');

const { UserSchemas } = require('./schemas');
const { handleErrorDetails } = require('./handlers');

function validateRegisterUser (req, res, next) {
  const { error } = UserSchemas.registerUserSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateLoginUser (req, res, next) {
  const { error } = UserSchemas.loginUserSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

function validateUserId (req, res, next) {
  const { error } = UserSchemas.userIdSchema.validate(req, validationOptions);

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

module.exports = {
  validateRegisterUser,
  validateUserId,
  validateLoginUser
};
