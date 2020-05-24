const config = require('config');

const { ValidationError } = require('../errors');

const validationOptions = config.get('validation.options');

class ValidationHandlerUtil {
  static validate(schema, req, next) {
    const { error } = schema.validate(req, validationOptions);

    if (error) {
      return ValidationHandlerUtil.handleErrorDetails(error, next);
    }

    return next();
  }

  static handleErrorDetails(error, next) {
    const details = error.details.reduce((acc, detail) => `${acc} ${detail.message}`, '');

    return next(new ValidationError(details));
  }
}

module.exports = ValidationHandlerUtil;
