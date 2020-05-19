const Joi = require('@hapi/joi');

const registerUserSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().trim().max(100).required(),
    lastName: Joi.string().trim().max(100).trim().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    email: Joi.string().trim().email().required()
  })
});

const userIdSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  })
});

module.exports = {
  registerUserSchema,
  userIdSchema,
};
