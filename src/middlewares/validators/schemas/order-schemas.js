const Joi = require('@hapi/joi');
const config = require('config');

const reason = config.get('validation.order.complaints.reason');
const deliveryStatus = config.get('validation.order.deliveryStatus');

const { string, number } = Joi.types();

const getOrderSchema = Joi.object({
  params: Joi.object({
    productId: string.hex().length(24).required(),
  }),
});

const orderListSchema = Joi.object({
  query: Joi.object({
    limit: number.integer().positive(),
    skip: number.integer().positive(),
  }),
});

const createOrderSchema = Joi.object({
  body: Joi.object({
    paymentMethodId: string.hex().length(24),
    products: Joi.array().items({
      productId: string.hex().length(24).required(),
      quantity: number.integer().positive().required(),
    }).required(),
  }),
});

const createOrderComplaintSchema = Joi.object({
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

const orderIdSchema = Joi.object({
  params: Joi.object({
    orderId: Joi.string().hex().length(24),
  }),
});

const deliveryStatusSchema = Joi.object({
  params: Joi.object({
    orderId: Joi.string().hex().length(24),
  }),
  body: Joi.object({
    deliveryStatus: Joi.string().valid(...deliveryStatus).required(),
  }),
});

module.exports = {
  getOrderSchema,
  orderListSchema,
  createOrderSchema,
  createOrderComplaintSchema,
  orderIdSchema,
  deliveryStatusSchema,
};
