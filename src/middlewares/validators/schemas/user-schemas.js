const Joi = require('@hapi/joi');

const addressSchema = Joi.object({
  zipCode: Joi.string().trim().max(100).required(),
  street: Joi.string().trim().max(100).required(),
  country: Joi.string().trim().max(100).required(),
  city: Joi.string().trim().max(100).required()
});

const registerUserSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().trim().max(100).required(),
    lastName: Joi.string().trim().max(100).trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    mobilePhone: Joi.string().pattern(new RegExp('^0\\d{2}-\\d{2}-\\d{2}-\\d{2}$')),
    image: Joi.string().pattern(new RegExp('([a-z\\-_0-9\\/\\:\\.]*\\.(jpg|jpeg|png|gif))')),
    address: addressSchema
  })
});

const loginUserSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required()
  })
});


module.exports = {
  registerUserSchema,
  loginUserSchema
};
