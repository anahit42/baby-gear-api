const Joi = require('@hapi/joi');
const config = require('config');

const cardTypes = config.get('validation.cardTypes');

const createCardSchema = Joi.object({
  body: Joi.object({
    number: Joi.string().required(),
    expMonth: Joi.number().required(),
    expYear: Joi.number().required(),
    cvc: Joi.string().required(),
    type: Joi.string().valid(...cardTypes).required(),
  }),
});

module.exports = {
  createCardSchema,
};
