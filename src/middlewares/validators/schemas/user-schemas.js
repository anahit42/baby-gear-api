const Joi = require('@hapi/joi');

const registerUserSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().trim().max(100).required(),
    lastName: Joi.string().trim().max(100).trim().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    email: Joi.string().trim().email().required()
  })
});

const updateUserSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().trim().max(100),
    lastName: Joi.string().trim().max(100).trim(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
    email: Joi.string().trim().email()
  })
});

module.exports = {
  registerUserSchema,
  updateUserSchema
};
