const config = require('config');

const validationOptions = config.get('validation.options');

const { ValidationError } = require('../../errors');
const { UserSchemas } = require('./schemas');

function validateRegisterUser (req, res, next) {
  const { error } = UserSchemas.registerUserSchema.validate(req, validationOptions);

  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }

  return next();
}

function validateUpdateUser (req, res, next) {

  const { error } = UserSchemas.updateUserSchema.validate(req, validationOptions);

  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`;
    }, '');

    return next(new ValidationError(details));
  }

  return next();
}

module.exports = {
  validateRegisterUser,
  validateUpdateUser
};
