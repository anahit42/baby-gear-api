const config = require('config');

const validationOptions = config.get('validation.options');

const { ValidationError } = require('../../errors');
const { UserSchemas } = require('./schemas');

function validateCreateUser (req, res, next) {
  const { error } = UserSchemas.createUserSchema.validate(req, validationOptions);

  if (error) {
    const details = error.details.reduce((acc, detail) => {
      return `${acc} ${detail.message}`
    }, '');

    return next(new ValidationError(details));
  }

  return next();
}

module.exports = {
  validateCreateUser
};
