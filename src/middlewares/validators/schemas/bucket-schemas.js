const Joi = require('@hapi/joi');

const bucketIdSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports = { bucketIdSchema };
