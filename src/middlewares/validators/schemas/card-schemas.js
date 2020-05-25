const Joi = require('@hapi/joi');
const config = require('config');

const cardTypes = config.get('validation.cardTypes');

const createCardSchema = Joi.object({
  body: Joi.object({
    number: Joi.string().required(),
    expMonth: Joi.string().required(),
    expYear: Joi.string().required(),
    cvc: Joi.string().required(),
    type: Joi.string().valid(...cardTypes).required(),
  }),
});

module.exports = {
  createCardSchema,
};
