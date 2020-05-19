const config = require('config');

const validationOptions = config.get('validation.options');

const { ValidationError } = require('../../errors');
const { UserSchemas } = require('./schemas');

function validateRegisterUser (req, res, next) {
  const { error } = UserSchemas.registerUserSchema.validate(req, validationOptions);

  if (error) {
    handleErrorDetails(error, next);
  }

  return next();
}

function validateLoginUser (req, res, next) {
  const { error } = UserSchemas.loginUserSchema.validate(req, validationOptions);

  if (error) {
    handleErrorDetails(error, next);
  }

  return next();
}

function handleErrorDetails(error, next) {
  const details = error.details.reduce((acc, detail) => {
    return `${acc} ${detail.message}`;
  }, '');

  return next(new ValidationError(details));
}


module.exports = {
  validateRegisterUser,
  validateLoginUser
};
