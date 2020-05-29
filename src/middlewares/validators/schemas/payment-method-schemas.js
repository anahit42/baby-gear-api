const Joi = require('@hapi/joi');
const config = require('config');
const JoiStringExtension = require('../extensions/joi-string-extension');

const paymentTypes = config.get('validation.paymentTypes');

const shippingAddressSchema = Joi.object({
  line1: Joi.string().trim().max(100).required(),
  city: Joi.string().trim().max(100).required(),
  country: JoiStringExtension.string().countryCode().required(),
  postal_code: Joi.string().trim().max(100).required(),
});

const billingAddressSchema = Joi.object({
  line1: Joi.string().trim().max(100),
  city: Joi.string().trim().max(100),
  country: JoiStringExtension.string().countryCode().length(2),
  postal_code: Joi.string().trim().max(100),
});

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
    isDefaultMethod: Joi.boolean().required(),
    shipping: Joi.object({
      address: shippingAddressSchema,
      name: Joi.string().trim().max(100).required(),
      phone: JoiStringExtension.string().phoneNumber().required(),
    }),
  }),
});

const updatePaymentMethodSchema = Joi.object({
  params: Joi.object({
    paymentMethodId: Joi.string().hex().length(24),
  }),
  body: Joi.object({
    billingDetails: Joi.object({
      billingAddressSchema,
      name: Joi.string().trim().max(100),
      phone: JoiStringExtension.string().phoneNumber(),
      email: Joi.string().trim().email(),
    }),
    isDefaultMethod: Joi.boolean(),
  })
});

const paymentMethodIdSchema = Joi.object({
  params: Joi.object({
    paymentMethodId: Joi.string().hex().length(24),
  }),
});


module.exports = {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
  paymentMethodIdSchema,
};
