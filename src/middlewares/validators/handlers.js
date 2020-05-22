const Joi = require('@hapi/joi');

const { ValidationError } = require('../../errors');

function handleErrorDetails(error, next) {
  const details = error.details.reduce((acc, detail) => `${acc} ${detail.message}`, '');

  return next(new ValidationError(details));
}

function validateSkipLimit(req, res, next) {
  const { skip, limit } = req.query;

  const schema = Joi.object().keys({
    limit: Joi.number().integer().positive(),
    skip: Joi.number().integer().positive(),
  });

  const result = schema.validate({ skip, limit });

  if (result.error) {
    const { details } = result.error;

    const message = details.map((detail) => detail.message).join(',');

    return next(new ValidationError(message));
  }

  return next();
}

module.exports = {
  handleErrorDetails,
  validateSkipLimit,
};
