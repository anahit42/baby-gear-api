const Joi = require('@hapi/joi');

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

const orderIdSchema = Joi.object({
  params: Joi.object({
    orderId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  orderGetSingle,
  orderList,
  createOrder,
  orderIdSchema,
};
