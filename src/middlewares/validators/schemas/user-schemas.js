const Joi = require('@hapi/joi');

const createUserSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().trim().max(100).required(),
    lastName: Joi.string().trim().max(100).trim().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    email: Joi.string().trim().email().required()
  })
});

module.exports = {
  createUserSchema
};
