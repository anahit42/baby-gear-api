const Joi = require('@hapi/joi');

const { ValidationError } = require('../../errors');

function handleErrorDetails(error, next) {
  const details = error.details.reduce((acc, detail) => `${acc} ${detail.message}`, '');

  return next(new ValidationError(details));
}

function validateSkipLimit(req, res, next) {
  const { skip, limit } = req.query;

  const schema = Joi.object().keys({
    limit: Joi.number().integer().positive().optional(),
    skip: Joi.number().integer().positive().optional(),
  });

  const { error } = schema.validate({ skip, limit });

  if (error) {
    return handleErrorDetails(error, next);
  }

  return next();
}

module.exports = {
  handleErrorDetails,
  validateSkipLimit,
};
