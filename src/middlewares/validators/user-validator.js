const config = require('config');

const validationOptions = config.get('validation.options');

const { ValidationError, ForbiddenError } = require('../../errors');
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

function validateUserId (req, res, next) {
  const { error } = UserSchemas.userIdSchema.validate(req, validationOptions);

  if (error) {
    return next(new ForbiddenError('Access to the requested resource is forbidden.'));
  }

  return next();
}

module.exports = {
  validateRegisterUser,
  validateUserId,
};
