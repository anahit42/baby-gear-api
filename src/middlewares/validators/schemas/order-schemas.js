const Joi = require('@hapi/joi');
const config = require('config');

const reason = config.get('validation.order.complaints.reason');

const { string, number } = Joi.types();

const orderGetSingle = Joi.object({
  params: Joi.object({
    productId: string.hex().length(24).required(),
  }),
});

const orderList = Joi.object({
  query: Joi.object({
    limit: number.integer().positive(),
    skip: number.integer().positive(),
  }),
});

const createOrder = Joi.object({
  body: Joi.object({
    paymentMethodId: string.hex().length(24),
    products: Joi.array().items({
      productId: string.hex().length(24).required(),
      quantity: number.integer().positive().required(),
    }).required(),
  }),
});

const complainOrder = Joi.object({
  params: Joi.object({
    orderId: string.hex().length(24).required(),
  }),
  body: Joi.object({
    complaints: Joi.array().items({
      reason: string.valid(...reason).trim().required(),
      comments: string.trim().max(400).required(),
    }).required(),
  }),
});

module.exports = {
  orderGetSingle,
  orderList,
  createOrder,
  complainOrder,
};
