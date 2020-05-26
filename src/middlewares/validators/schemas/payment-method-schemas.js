const Joi = require('@hapi/joi');
const config = require('config');

const paymentTypes = config.get('validation.paymentTypes');

const cardSchema = Joi.object({
  number: Joi.string().required(),
  exp_month: Joi.number().required(),
  exp_year: Joi.number().required(),
  cvc: Joi.string().required(),
});

const createPaymentMethodSchema = Joi.object({
  body: Joi.object({
    type: Joi.string().valid(...paymentTypes).required(),
    card: cardSchema.when('type', { is: 'card', then: Joi.object().required() }),
    defaultMethod: Joi.boolean(),
  }),
});

module.exports = {
  createPaymentMethodSchema,
};
